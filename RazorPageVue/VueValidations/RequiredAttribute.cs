using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.ComponentModel.DataAnnotations;

namespace RazorPageVue.VueValidations
{
    /// <summary>
    /// 入力必須属性
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class RequiredAttribute : ValidationAttribute, IClientModelValidator
    {
        /// <summary>
        /// コンストラクタ
        /// </summary>
        public RequiredAttribute(): base()
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
            if (value == null)
            {
                return new ValidationResult(GetErrorMessage(validationContext.DisplayName));
            }
            else
            {
                if (value.GetType() == typeof(string))
                {
                    if (string.IsNullOrWhiteSpace((string)value))
                    {
                        return new ValidationResult(GetErrorMessage(validationContext.DisplayName));
                    }
                    else
                    {
                        return ValidationResult.Success;
                    }
                }
                else
                {
                    return ValidationResult.Success;
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

            // 以下のタグ属性を設定する
            // required                         "required"
            // required-err-msg                 バリデーションで設定されたエラーメッセージ
            context.Attributes["required"] = "required";
            if (!string.IsNullOrWhiteSpace(ErrorMessage)) context.Attributes["required-err-msg"] = ErrorMessage;
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
                return displayName + "は入力必須です。";
            }
            else
            {
                return ErrorMessage;
            }
        }

    }
}
