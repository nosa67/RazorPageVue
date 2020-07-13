using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Text.RegularExpressions;

namespace RazorPageVue.VueValidations
{
    public class EmailAttribute : ValidationAttribute, IClientModelValidator
    {
        /// <summary>
        /// Emailが異常だった場合のエラーメッセージ
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

            // EMailチェック
            if (IsValidEmail(value.ToString()))
            {
                return ValidationResult.Success;
            }
            else
            {
                return new ValidationResult(GetEmailErrorMessage(validationContext.DisplayName));
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
            // type         "email"
            // url-err-msg  バリデーションで設定されたエラーメッセージ
            context.Attributes["type"] = "email";
            if (!string.IsNullOrWhiteSpace(ErrorMessage)) context.Attributes["typemismatch-err-msg"] = ErrorMessage; 
        }

        /// <summary>
        /// e-mailアドレスの正当性チェック
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                // Normalize the domain
                email = Regex.Replace(email, @"(@)(.+)$", DomainMapper,
                                      RegexOptions.None, TimeSpan.FromMilliseconds(200));

                // Examines the domain part of the email and normalizes it.
                string DomainMapper(Match match)
                {
                    // Use IdnMapping class to convert Unicode domain names.
                    var idn = new IdnMapping();

                    // Pull out and process domain name (throws ArgumentException on invalid)
                    var domainName = idn.GetAscii(match.Groups[2].Value);

                    return match.Groups[1].Value + domainName;
                }
            }
            catch (RegexMatchTimeoutException e)
            {
                return false;
            }
            catch (ArgumentException e)
            {
                return false;
            }

            try
            {
                return Regex.IsMatch(email,
                    @"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
                    @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-0-9a-z]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$",
                    RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
        }

        /// <summary>
        /// Email文字列が異常な場合のエラーメッセージ取得
        /// </summary>
        /// <param name="displayName">表示名称（DisplayNameアトリビュートで変更できる）</param>
        /// <returns>必須エラーメッセージ</returns>
        string GetEmailErrorMessage(string displayName)
        {
            if (string.IsNullOrEmpty(ErrorMessage))
            {
                return displayName + "にはメールアドレスを入力してください。";
            }
            else
            {
                return ErrorMessage;
            }
        }
    }
}
