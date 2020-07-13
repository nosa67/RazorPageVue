using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace RazorPageVue.VueValidations
{
    public class UrlAttribute : ValidationAttribute, IClientModelValidator
    {
        /// <summary>
        /// URLが異常だった場合のエラーメッセージ
        /// </summary>
        public string ErrorMessage { get; set; }

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

            // URLチェック
            if (Regex.IsMatch(value.ToString(), @"^s?https?://[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+$"))
            {
                return ValidationResult.Success;
            }
            else
            {
                return new ValidationResult(GetURLErrorMessage(validationContext.DisplayName));
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
            // type         "url"
            // url-err-msg  バリデーションで設定されたエラーメッセージ
            context.Attributes["type"] = "url";
            if (!string.IsNullOrWhiteSpace(ErrorMessage)) context.Attributes["typemismatch-err-msg"] = ErrorMessage;
        }

        /// <summary>
        /// URL文字列が異常な場合のエラーメッセージ取得
        /// </summary>
        /// <param name="displayName">表示名称（DisplayNameアトリビュートで変更できる）</param>
        /// <returns>必須エラーメッセージ</returns>
        string GetURLErrorMessage(string displayName)
        {
            if (string.IsNullOrEmpty(ErrorMessage))
            {
                return displayName + "にはURLを入力してください。";
            }
            else
            {
                return ErrorMessage;
            }
        }
    }
}
