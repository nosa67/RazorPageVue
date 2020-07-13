using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using RazorPageVue.VueValidations;

namespace RazorPageVue.Pages
{
    public class DateInputModel : PageModel
    {
        /// <summary>
        /// 結合データ
        /// </summary>
        [BindProperty]
        public InputModel BindData { get; set; } = new InputModel();

        public class InputModel
        {
            /// <summary>
            /// バリデーションなし
            /// </summary>
            public DateTime? Nochek { get; set; } = null;

            /// <summary>
            /// 入力必須
            /// </summary>
            [Required]
            public DateTime? Required { get; set; } = null;

            /// <summary>
            /// 入力必須でエラーメッセージ変更
            /// </summary>
            [Required(ErrorMessage ="入力必須（変更）")] 
            public DateTime? RequiredErrch { get; set; } = null;
            
        }

        public void OnGet()
        {
        }

        /// <summary>
        /// Post処理
        /// </summary>
        /// <returns></returns>
        public IActionResult OnPost()
        {
            return RedirectToPage("DateInputResult", this.BindData);
        }
    }
}
