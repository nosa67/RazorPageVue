using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RazorPageVue.VueValidations;

namespace RazorPageVue.Pages
{
    public class TextInputModel : PageModel
    {
        /// <summary>
        /// 結合データ
        /// </summary>
        [BindProperty]
        public InputModel BindData { get; set; } = new InputModel();

        public class InputModel
        {
            public string TextNocheck { get; set; } = "TextNocheck";

            [Required]
            public string TextRequired { get; set; } = "";

            [Required(ErrorMessage = "必須エラーメッセージ変更")]
            public string TextRequiredMsgChange { get; set; } = "";

            [StringLength(MinLength = 5)]
            public string TextMinLength { get; set; } = "aaa";

            [StringLength(MinLength = 5, UnderMinErrorMessage = "最小文字数エラーメッセージ変更")]
            public string TextMinLengthMsg { get; set; } = "aaa";

            [StringLength(MaxLength = 10)]
            public string TextMaxLength { get; set; } = "aaaaaaaaaab";

            [StringLength(MaxLength = 10, OverMaxErrorMessage = "最大文字数エラーメッセージ変更")]
            public string TextMaxLengthMsg { get; set; } = "aaaaaaaaaab";

            [StringLength(MinLength = 5, MaxLength = 10)]
            public string TextMinMaxLength { get; set; } = "ｃｃｃｃｃｃｃｃｃｃｄ";

            public string TextCompaire1 { get; set; } = "aaa";
            [Compare(CompareTarget = "TextCompaire1")]
            public string TextCompaire2 { get; set; } = "bbb";

            public string TextCompaireMsg1 { get; set; } = "aaa";
            [Compare(CompareTarget = "TextCompaireMsg1", ErrorMessage = "比較メッセージ変更")]
            public string TextCompaireMsg2 { get; set; } = "bbb";

            [Url]
            public string TextURL { get; set; }

            [Url(ErrorMessage = "URLエラー変更")]
            public string TextURLMsg { get; set; }

            [Email]
            public string TextEMail { get; set; }

            [Email(ErrorMessage = "Emailエラー変更")]
            public string TextEMailMsg { get; set; }

        }

        public void OnGet()
        {
            BindData.TextURL = "not url";
            BindData.TextURLMsg = "not url";
            BindData.TextEMail = "not email";
            BindData.TextEMailMsg = "not email";
        }

        /// <summary>
        /// Post処理
        /// </summary>
        /// <returns></returns>
        public IActionResult OnPost()
        {
            return RedirectToPage("TextInputResult", this.BindData);
        }
    }
}
