using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.ComponentModel.DataAnnotations;

namespace RazorPageVue.VueValidations
{
    [AttributeUsage(AttributeTargets.Property)]
    public class StringLengthAttribute : ValidationAttribute, IClientModelValidator
    {
        /// <summary>
        /// 最小長 0 ならチェック対象外
        /// </summary>
        public int MaxLength { get; set; } = 0;

        /// <summary>
        /// 最大を超えた場合のエラーメッセージ
        /// </summary>
        public string OverMaxErrorMessage { get; set; }

        /// <summary>
        /// 最大長　0 ならチェック対処具合
        /// </summary>
        public int MinLength { get; set; } = 0;

        /// <summary>
        /// 最大を超えた場合のエラーメッセージ
        /// </summary>
        public string UnderMinErrorMessage { get; set; }

        /// <summary>
        /// バリデーション（サーバーサイド）
        /// </summary>
        /// <param name="value">値</param>
        /// <param name="validationContext">バリデーションコンテキスト</param>
        /// <returns></returns>
        protected override ValidationResult IsValid(
            object value, ValidationContext validationContext)
        {
            // 入力が空の場合は常に正常（空のチェックは入力必須でおこなう）
            if (value == null) return ValidationResult.Success;

            // 最小桁数チェック
            if ((MinLength > 0) && (value.ToString().Trim().Length < MinLength))
            {
                return new ValidationResult(GetUnderMinErrorMessage(validationContext.DisplayName));
            }

            // 最大桁数チェック
            if ((MaxLength > 0) && value.ToString().Trim().Length > MaxLength)
            {
                return new ValidationResult(GetOverMaxErrorMessage(validationContext.DisplayName));
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

            if (MinLength > 0)
            {
                // 最小値が設定されている場合以下のタグ属性を設定する
                // minlength                            最小桁数
                // min-length-err-msg                   バリデーションで設定されたエラーメッセージ
                context.Attributes["minlength"] = MinLength.ToString();
                if (!string.IsNullOrWhiteSpace(UnderMinErrorMessage)) context.Attributes["minlength-err-msg"] = UnderMinErrorMessage;
            }

            if (MaxLength > 0)
            {
                // 最大値が設定されている場合以下のタグ属性を設定する
                // maxlength                            最大桁数
                // max-length-err-msg                   バリデーションで設定されたエラーメッセージ
                context.Attributes["maxlength"] = MaxLength.ToString(); 
                if (!string.IsNullOrWhiteSpace(OverMaxErrorMessage)) context.Attributes["maxlength-err-msg"] = OverMaxErrorMessage;
            }
        }

        /// <summary>
        /// 最大多数のサーバーバリデーション時のエラーメッセージ取得
        /// </summary>
        /// <param name="displayName">表示名称（DisplayNameアトリビュートで変更できる）</param>
        /// <returns>必須エラーメッセージ</returns>
        string GetOverMaxErrorMessage(string displayName)
        {
            if (string.IsNullOrEmpty(OverMaxErrorMessage))
            {
                return displayName + "の値が最大値「" + MaxLength.ToString() + "」を超えています。";
            }
            else
            {
                return OverMaxErrorMessage;
            }
        }

        /// <summary>
        /// 最小桁数のサーバーバリデーション時のエラーメッセージ取得
        /// </summary>
        /// <param name="displayName">表示名称（DisplayNameアトリビュートで変更できる）</param>
        /// <returns>必須エラーメッセージ</returns>
        string GetUnderMinErrorMessage(string displayName)
        {
            if (string.IsNullOrEmpty(UnderMinErrorMessage))
            {
                return displayName + "の値が最小値「" + MinLength.ToString() + "」より小さいです。";
            }
            else
            {
                return UnderMinErrorMessage;
            }
        }
    }
}
