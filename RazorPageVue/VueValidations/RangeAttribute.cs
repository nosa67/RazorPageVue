using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RazorPageVue.VueValidations
{
    public class RangeAttribute : ValidationAttribute, IClientModelValidator
    {
        enum RangeValueTypes
        {
            NoNumber =   -1,
            Integer = 0,
            Real = 1,
            TimeSpan = 2,
            DateTime = 3,
            String = 4
        }

        /// <summary>
        /// 最小値
        /// </summary>
        public object Min { get; set; }

        /// <summary>
        /// 最小値以下のエラーメッセージ
        /// </summary>
        public string MinErrorMessage { get; set; }

        /// <summary>
        /// 最大値
        /// </summary>
        public object Max { get; set; }

        /// <summary>
        /// 最大値以下のエラーメッセージ
        /// </summary>
        public string MaxErrorMessage { get; set; }

        /// <summary>
        /// ステップ
        /// </summary>
        public object Step { get; set; }

        /// <summary>
        /// ステップに一致しないエラーメッセージ
        /// </summary>
        public string StepErrorMessage { get; set; }

        /// <summary>
        /// バリデーション（サーバーサイド）
        /// </summary>
        /// <param name="value">値</param>
        /// <param name="validationContext">バリデーションコンテキスト</param>
        /// <returns></returns>
        protected override ValidationResult IsValid(
            object value, ValidationContext validationContext)
        {
            if(value == null) return ValidationResult.Success;

            var valueType = GetTypeThrowNullable(value.GetType());

            if (value.GetType() == typeof(TimeSpan))
            {
                if (Min != null)
                {

                    if ((TimeSpan)value < TimeSpan.Parse(Min.ToString()))
                    {
                        if (string.IsNullOrEmpty(MinErrorMessage))
                        {
                            return new ValidationResult(MinErrorMessage);
                        }
                        else
                        {
                            return new ValidationResult(Min.ToString() + "以上の値を入力してください。");
                        }
                    }

                    // 最大値チェック
                    if (Max != null)
                    {
                        if ((TimeSpan)value > TimeSpan.Parse(Max.ToString()))
                        {
                            if (string.IsNullOrEmpty(MaxErrorMessage))
                            {
                                return new ValidationResult(MaxErrorMessage);
                            }
                            else
                            {
                                return new ValidationResult(Max.ToString() + "以下の値を入力してください。");
                            }
                        }
                    }

                    // Stepチェック(minが無いので0起点)
                    if (Step != null)
                    {
                        var totalSeconds = (int)((TimeSpan)value).TotalSeconds;

                        if (totalSeconds % int.Parse(Step.ToString()) != 0)
                        {
                            if (string.IsNullOrEmpty(StepErrorMessage))
                            {
                                return new ValidationResult(StepErrorMessage);
                            }
                            else
                            {
                                return new ValidationResult("ステップ[" + Step.ToString() + "]の刻み幅に一致しません。");
                            }
                        }
                    }
                }
            }
            else
            {
                // 最小値チェック
                if (Min != null)
                {

                    if (((IComparable)value).CompareTo(Convert.ChangeType(Min, valueType)) > 0)
                    {
                        if (string.IsNullOrEmpty(MinErrorMessage))
                        {
                            return new ValidationResult(MinErrorMessage);
                        }
                        else
                        {
                            return new ValidationResult(Min.ToString() + "以上の値を入力してください。");
                        }
                    }


                    // Stepチェック
                    if (Step != null)
                    {
                        if (valueType == typeof(ulong))
                        {
                            var uAmari = ((ulong)value - (ulong)Convert.ChangeType(Min, typeof(ulong))) % (ulong)Convert.ChangeType(Step, typeof(ulong));
                            if (uAmari != 0) return new ValidationResult("最小値[" + Min.ToString() + "]から刻み[" + Step.ToString() + "]の値ではありません。");
                        }
                        else if (getNumberType(valueType) == RangeValueTypes.Integer)
                        {
                            var iAmari = ((long)Convert.ChangeType(value, typeof(long)) - (long)Convert.ChangeType(Min, typeof(long))) % (long)Convert.ChangeType(Step, typeof(long));
                            if (iAmari != 0) return new ValidationResult("最小値[" + Min.ToString() + "]から刻み[" + Step.ToString() + "]の値ではありません。");
                        }
                        else
                        {
                            var decimalValue = decimal.Parse(value.ToString());
                            var decimalMin = decimal.Parse(Min.ToString());
                            var decimalStep = decimal.Parse(Step.ToString());

                            var decimalAmari = decimalValue - decimalMin % decimalStep;
                            if (decimalAmari != 0) return new ValidationResult("最小値[" + Min.ToString() + "]から刻み[" + Step.ToString() + "]の値ではありません。");
                        }
                    }

                }
                else
                {
                    // Stepチェック(minが無いので0起点)
                    if (Step != null)
                    {
                        if (valueType == typeof(ulong))
                        {
                            var uAmari = (ulong)value % (ulong)Convert.ChangeType(Step, typeof(ulong));
                            if (uAmari != 0) return new ValidationResult("最小値[" + Min.ToString() + "]から刻み[" + Step.ToString() + "]の値ではありません。");
                        }
                        else if (getNumberType(valueType) == RangeValueTypes.Integer)
                        {
                            var iAmari = (long)Convert.ChangeType(value, typeof(long)) % (long)Convert.ChangeType(Step, typeof(long));
                            if (iAmari != 0) return new ValidationResult("0から刻み[" + Step.ToString() + "]の値ではありません。");
                        }
                        else
                        {
                            var decimalValue = decimal.Parse(value.ToString());
                            var decimalMin = 0;
                            var decimalStep = decimal.Parse(Step.ToString());

                            var decimalAmari = decimalValue - decimalMin % decimalStep;
                            if (decimalAmari != 0) return new ValidationResult("刻み[" + Step.ToString() + "]の値ではありません。");
                        }
                    }
                }

                // 最大値チェック
                if (Max != null)
                {
                    if (((IComparable)value).CompareTo(Convert.ChangeType(Max, valueType)) < 0)
                    {
                        if (string.IsNullOrEmpty(MaxErrorMessage))
                        {
                            return new ValidationResult(MaxErrorMessage);
                        }
                        else
                        {
                            return new ValidationResult(Max.ToString() + "以下の値を入力してください。");
                        }
                    }
                }
            }

            return ValidationResult.Success;
        }

        /// <summary>
        /// クライアントでのバリデーション用の操作
        /// </summary>
        /// <param name="context">クライアントのバリデーションコンテキスト</param>
        public void AddValidation(ClientModelValidationContext context)
        {
            if (context == null) throw new ArgumentNullException(nameof(context));

            var valueNumberType = getNumberType(context.ModelMetadata.ModelType);
            if (valueNumberType == RangeValueTypes.NoNumber)
            {
                throw new VueServerException("範囲指定のバリデーションが設定されていますが、参照している値は範囲指定できません。");
            }
            else if (valueNumberType == RangeValueTypes.Integer)
            {
                CheckIntegerParameter(context);
            }
            else if (valueNumberType == RangeValueTypes.Real)
            {
                CheckRealParamtere(context);
            }
            else if (valueNumberType == RangeValueTypes.TimeSpan)
            {
                CheckTimespanParameter(context);
            }
            else if (valueNumberType == RangeValueTypes.DateTime)
            {
                CheckDatetimeParameter(context);
            }
        }

        /// <summary>
        /// 値が整数の場合の範囲指定パラメータのチェックとHTMLへの反映
        /// </summary>
        /// <param name="context"></param>
        private void CheckIntegerParameter(ClientModelValidationContext context)
        {
            // Minのチェックと設定
            if (Min != null)
            {
                // Minは整数以外はエラー
                //if(getNumberType(Min.GetType()) != RangeValueTypes.Integer) throw new VueServerException("範囲指定のバリデーションで整数の項目に整数以外の「Min」が設定されています。");

                // タグの属性[min]に最小値を設定
                context.Attributes["min"] = Min.ToString();

                // 最小値の異常メッセージが設定されている場合はタグの属性[min-error-message]に設定
                if (!string.IsNullOrEmpty(MinErrorMessage)) context.Attributes["min-error-message"] = MinErrorMessage;
            }

            // 最大値と最大値のエラーメッセージを設定
            if (Max != null)
            {
                // Minは整数以外はエラー
                if (getNumberType(Max.GetType()) != RangeValueTypes.Integer) throw new VueServerException("範囲指定のバリデーションで整数の項目に整数以外の「Max」が設定されています。");

                // タグの属性[max]に最小値を設定
                context.Attributes["max"] = Max.ToString();

                // 最大値の異常メッセージが設定されている場合はタグの属性[max-error-message]に設定
                if (!string.IsNullOrEmpty(MaxErrorMessage)) context.Attributes["max-error-message"] = MaxErrorMessage;
            }

            // StepとStepのエラーメッセージを設定
            if (Step != null)
            {
                // Stepは整数以外はエラー
                if (getNumberType(Step.GetType()) != RangeValueTypes.Integer) throw new VueServerException("範囲指定のバリデーションで整数の項目に整数以外の「Step」が設定されています。");

                // タグの属性[step]に最小値を設定
                context.Attributes["step"] = Step.ToString();

                // 最刻み幅の異常メッセージが設定されている場合はタグの属性[step-error-message]に設定
                if (!string.IsNullOrEmpty(StepErrorMessage)) context.Attributes["step-error-message"] = StepErrorMessage;
            }
        }

        /// <summary>
        /// 値が実数の場合の範囲指定パラメータのチェックとHTMLへの反映
        /// </summary>
        /// <param name="context"></param>
        private void CheckRealParamtere(ClientModelValidationContext context)
        {
            // Minのチェックと設定
            if (Min != null)
            {
                var minType = getNumberType(Min.GetType());

                // Minは整数と小数以外はエラー
                if (minType != RangeValueTypes.Integer && minType != RangeValueTypes.Real) throw new VueServerException("範囲指定のバリデーションで実数の項目に数値以外の「Min」が設定されています。");

                // タグの属性[min]に最小値を設定
                context.Attributes["min"] = Min.ToString(); 

                // 最小値の異常メッセージが設定されている場合はタグの属性[min-error-message]に設定
                if (!string.IsNullOrEmpty(MinErrorMessage)) context.Attributes["min-error-message"] = MinErrorMessage;
            }

            // 最大値と最大値のエラーメッセージを設定
            if (Max != null)
            {
                var maxType = getNumberType(Max.GetType());

                // Minは整数以外はエラー
                if (maxType != RangeValueTypes.Integer && maxType != RangeValueTypes.Real) throw new VueServerException("範囲指定のバリデーションで実数の項目に数値以外の「Max」が設定されています。");

                // タグの属性[max]に最小値を設定
                context.Attributes["max"] = Max.ToString(); 

                // 最大値の異常メッセージが設定されている場合はタグの属性[max-error-message]に設定
                if (!string.IsNullOrEmpty(MaxErrorMessage)) context.Attributes["max-error-message"] = MaxErrorMessage;
            }

            // StepとStepのエラーメッセージを設定
            if (Step != null)
            {
                var stepType = getNumberType(Step.GetType());

                // Stepは整数以外はエラー
                if (stepType != RangeValueTypes.Integer && stepType != RangeValueTypes.Real) throw new VueServerException("範囲指定のバリデーションで整数の項目に整数以外の「Step」が設定されています。");

                // タグの属性[step]に最小値を設定
                context.Attributes["step"] = Step.ToString();

                // 最刻み幅の異常メッセージが設定されている場合はタグの属性[step-error-message]に設定
                if (!string.IsNullOrEmpty(StepErrorMessage)) context.Attributes["step-error-message"] = StepErrorMessage;
            }
        }

        /// <summary>
        /// 値が時間の場合の範囲指定パラメータのチェックとHTMLへの反映
        /// </summary>
        /// <param name="context"></param>
        private void CheckTimespanParameter(ClientModelValidationContext context)
        {
            // Minのチェックと設定
            if (Min != null)
            {
                // Minは時間以外はエラー
                if (getNumberType(Min.GetType()) != RangeValueTypes.String) throw new VueServerException("範囲指定のバリデーションで時間の項目に時間以外の「Min」が設定されています。");
                TimeSpan work;
                if(!TimeSpan.TryParse(Min.ToString(), out work)) throw new VueServerException("範囲指定のバリデーションで時間の項目に時間以外の「Min」が設定されています。");

                // タグの属性[min]に最小値を設定
                context.Attributes["min"] = Min.ToString(); 

                // 最小値の異常メッセージが設定されている場合はタグの属性[min-error-message]に設定
                if (!string.IsNullOrEmpty(MinErrorMessage)) context.Attributes["min-error-message"] = MinErrorMessage;
            }

            // 最大値と最大値のエラーメッセージを設定
            if (Max != null)
            {
                // Minは時間以外はエラー
                if (getNumberType(Max.GetType()) != RangeValueTypes.String) throw new VueServerException("範囲指定のバリデーションで時間の項目に時間以外の「Max」が設定されています。");
                TimeSpan work;
                if (!TimeSpan.TryParse(Max.ToString(), out work)) throw new VueServerException("範囲指定のバリデーションで時間の項目に時間以外の「Max」が設定されています。");


                // タグの属性[max]に最小値を設定
                context.Attributes["max"] = Max.ToString(); 

                // 最大値の異常メッセージが設定されている場合はタグの属性[max-error-message]に設定
                if (!string.IsNullOrEmpty(MaxErrorMessage)) context.Attributes["max-error-message"] = MaxErrorMessage;
            }

            // StepとStepのエラーメッセージを設定
            if (Step != null)
            {
                // Stepは時間以外はエラー
                if (getNumberType(Step.GetType()) != RangeValueTypes.Integer) throw new VueServerException("範囲指定のバリデーションで時間の項目に数値以外の「Step」が設定されています。（stepは秒数）");
                TimeSpan work;
                //if (!TimeSpan.TryParse(Step.ToString(), out work)) throw new VueServerException("範囲指定のバリデーションで時間の項目に時間以外の「Step」が設定されています。");

                // タグの属性[step]に最小値を設定
                context.Attributes["step"] = Step.ToString(); 

                // 最刻み幅の異常メッセージが設定されている場合はタグの属性[step-error-message]に設定
                if (!string.IsNullOrEmpty(StepErrorMessage)) context.Attributes["step-error-message"] = StepErrorMessage;
            }
        }

        /// <summary>
        /// 値が日時の場合の範囲指定パラメータのチェックとHTMLへの反映
        /// </summary>
        /// <param name="context"></param>
        private void CheckDatetimeParameter(ClientModelValidationContext context)
        {
            // Minのチェックと設定
            if (Min != null)
            {
                // Minは時間以外はエラー
                if (getNumberType(Min.GetType()) != RangeValueTypes.String) throw new VueServerException("範囲指定のバリデーションで日時の項目に日時以外の「Min」が設定されています。");
                DateTime work;
                if (!DateTime.TryParse(Min.ToString(), out work)) throw new VueServerException("範囲指定のバリデーションで日時の項目に日時以外の「Min」が設定されています。");

                // タグの属性[min]に最小値を設定
                context.Attributes["min"] = Min.ToString(); 

                // 最小値の異常メッセージが設定されている場合はタグの属性[min-error-message]に設定
                if (!string.IsNullOrEmpty(MinErrorMessage)) context.Attributes["min-error-message"] = MinErrorMessage;
            }

            // 最大値と最大値のエラーメッセージを設定
            if (Max != null)
            {
                // Minは時間以外はエラー
                if (getNumberType(Max.GetType()) != RangeValueTypes.String) throw new VueServerException("範囲指定のバリデーションで日時の項目に日時以外の「Max」が設定されています。");
                DateTime work;
                if (!DateTime.TryParse(Max.ToString(), out work)) throw new VueServerException("範囲指定のバリデーションで日時の項目に日時以外の「Max」が設定されています。");

                // タグの属性[max]に最小値を設定
                context.Attributes["max"] = Max.ToString(); 

                // 最大値の異常メッセージが設定されている場合はタグの属性[max-error-message]に設定
                if (!string.IsNullOrEmpty(MaxErrorMessage)) context.Attributes["max-error-message"] = MaxErrorMessage;
            }

            // StepとStepのエラーメッセージを設定
            if (Step != null)
            {
                // Stepは時間以外はエラー
                if (getNumberType(Step.GetType()) != RangeValueTypes.String) throw new VueServerException("範囲指定のバリデーションで日時の項目に日時以外の「Step」が設定されています。");
                DateTime work;
                if (!DateTime.TryParse(Step.ToString(), out work)) throw new VueServerException("範囲指定のバリデーションで日時の項目に日時以外の「Step」が設定されています。");

                // タグの属性[step]に最小値を設定
                context.Attributes["step"] = Step.ToString(); 

                // 最刻み幅の異常メッセージが設定されている場合はタグの属性[step-error-message]に設定
                if (!string.IsNullOrEmpty(StepErrorMessage)) context.Attributes["step-error-message"] = StepErrorMessage;
            }
        }

        /// <summary>
        /// 符号なし整数のデータ型リスト
        /// </summary>
        static List<Type> IntegerTypeList = new List<Type> { typeof(byte), typeof(ushort), typeof(uint), typeof(ulong),typeof(sbyte), typeof(short), typeof(int), typeof(long) };

        /// <summary>
        /// 実数のデータ型リスト
        /// </summary>
        static List<Type> RealTypeList = new List<Type> { typeof(float), typeof(double), typeof(decimal) };

        static List<Type> TimeTypeList = new List<Type> { typeof(TimeSpan) };

        static List<Type> DateTypeList = new List<Type> { typeof(DateTime) };

        static List<Type> StringTypeList = new List<Type> { typeof(string) };

        /// <summary>
        /// 数値の種類を返す
        /// </summary>
        /// <param name="valueType">調べる型</param>
        /// <returns>数値の種類（整数 or 小数 or 数値以外）</returns>
        private RangeValueTypes getNumberType(Type valueType)
        {
            valueType = GetTypeThrowNullable(valueType);
            if (IntegerTypeList.Contains(valueType)) return RangeValueTypes.Integer;
            if (RealTypeList.Contains(valueType)) return RangeValueTypes.Real;
            if (TimeTypeList.Contains(valueType)) return RangeValueTypes.TimeSpan;
            if (DateTypeList.Contains(valueType)) return RangeValueTypes.DateTime;
            if (StringTypeList.Contains(valueType)) return RangeValueTypes.String;

            return RangeValueTypes.NoNumber;
        }

        private Type GetTypeThrowNullable(Type valueType)
        {
            if (valueType.IsGenericType && valueType.GetGenericTypeDefinition() == typeof(Nullable<>))
            {
                return Nullable.GetUnderlyingType(valueType);
            }
            else
            {
                return valueType;
            }
        }
    }
}
