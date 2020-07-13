using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.ComponentModel.DataAnnotations;

namespace RazorPageVue.VueValidations
{
    [AttributeUsage(AttributeTargets.Property)]
    public class CompareAttribute : ValidationAttribute, IClientModelValidator
    {
        /// <summary>
        /// 比較対象のプロパティ名
        /// </summary>
        public string CompareTarget { get; set; }

        /// <summary>
        /// コンストラクタ
        /// </summary>
        public CompareAttribute() : base()
        {
        }

        /// <summary>
        /// バリデーション（サーバーサイド）
        /// </summary>
        /// <param name="value">値</param>
        /// <param name="validationContext">バリデーションコンテキスト</param>
        /// <returns></returns>
        protected override ValidationResult IsValid(
            object value, ValidationContext validationContext)
        {
            // 比較対象の項目名をモデルから取得する
            var targetProp = validationContext.ObjectInstance.GetType().GetProperty(CompareTarget);
            if (targetProp == null) throw new VueValidationError("Compareバリデーションで設定されている対象の項目" + CompareTarget + "がモデル内に存在しません。)");

            // 比較対象の値を取得する
            var targetValue = targetProp.GetValue(validationContext.ObjectInstance);

            // 比較対象の項目の値を取得し、この項目の値（value）と比較している。
            // 基本的にはクライアントサイドで実施されるが、ここでは直接POSTされた場合の対処

            if (value == null)
            {
                if (targetProp.GetValue(validationContext.ObjectInstance) == null)
                {
                    // この項目と比較対象の項目がともにnullなら同一
                    return ValidationResult.Success;
                }
                else
                {
                    //  この項目がnullで比較対象がnull以外なので不一致エラーを返す
                    return new ValidationResult(GetErrorMessage(validationContext.DisplayName));
                }
            }
            else
            {
                if (targetValue == null)
                {
                    // この項目がnull以外で比較項目がnullなので不一致エラーを返す
                    return new ValidationResult(ErrorMessageString);
                }
                else
                {
                    // 比較対象の値とこの値の型が異なる場合はその旨の例外を発生させる
                    if (value.GetType() != targetValue.GetType()) throw new VueValidationError("Compareバリデーションで設定されている対象のデータ型が異なります。(" + value.GetType().Name + "," + validationContext.ObjectInstance.GetType().Name + ")");

                    // 文字列にして比較（もう少し修正する必要があるかも）
                    if (value.ToString() == targetValue.ToString())
                    {
                        return ValidationResult.Success;
                    }
                    else
                    {
                        return new ValidationResult(GetErrorMessage(validationContext.DisplayName));
                    }
                }
            }
        }

        /// <summary>
        /// クライアントでのバリデーション用の操作
        /// </summary>
        /// <param name="context">クライアントのバリデーションコンテキスト</param>
        public void AddValidation(ClientModelValidationContext context)
        {
            if (context == null) throw new ArgumentNullException(nameof(context));

            var targetProp = context.ModelMetadata.ContainerType.GetProperty(CompareTarget);

            // 比較対象のタグのIDを取得する（idの性質が）
            var targetId = context.Attributes["id"].Replace(context.ModelMetadata.Name, CompareTarget);

            // 以下のタグ属性を設定する
            // compare-item-id      比較対象の項目名
            // compare-err-msg      バリデーションで設定されたエラーメッセージ（html5には個のバリデーションはないので、デフォルトエラーは存在しない）
            context.Attributes["compare-id"] = targetId;
            if (!string.IsNullOrWhiteSpace(ErrorMessage)) context.Attributes["compare-err-msg"] = ErrorMessage; 
        }

        /// <summary>
        /// サーバーバリデーション時のエラーメッセージ取得
        /// </summary>
        /// <param name="displayName">表示名称（DisplayNameアトリビュートで変更できる）</param>
        /// <returns>必須エラーメッセージ</returns>
        string GetErrorMessage(string displayName)
        {
            if (string.IsNullOrEmpty(ErrorMessage))
            {
                return displayName + "に同じ値が設定されていません。";
            }
            else
            {
                return ErrorMessage;
            }
        }
    }
}
