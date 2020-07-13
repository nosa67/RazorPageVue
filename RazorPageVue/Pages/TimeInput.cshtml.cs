using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RazorPageVue.VueValidations;
using System;

namespace RazorPageVue.Pages
{
    public class TimeInputModel : PageModel
    {
        /// <summary>
        /// 結合データ
        /// </summary>
        [BindProperty]
        public InputModel BindData { get; set; } = new InputModel();

        public class InputModel
        {
            //--------------------------------------------------------------------------------
            //  必須入力チェック用
            //--------------------------------------------------------------------------------
            /// <summary>
            /// 基本のタイムスパン
            /// </summary>
            public TimeSpan? NormalTimeSpan { get; set; }

            /// <summary>
            /// 必須のタイムスパン
            /// </summary>
            [Required]
            public TimeSpan? RequiredTimeSpan { get; set; }

            /// <summary>
            /// 必須のタイムスパン
            /// </summary>
            [Required(ErrorMessage = "必須メッセージ変更")]
            public TimeSpan? RequiredTimeSpanChange { get; set; }

            //--------------------------------------------------------------------------------
            //  最小値チェック用
            //--------------------------------------------------------------------------------
            [Range(Min = "1:10")]
            public TimeSpan? MinTimeSpan { get; set; }

            [Range(Min = "1:15", MinErrorMessage ="最小変更")]
            public TimeSpan? MinErrTimeSpan { get; set; }

            //--------------------------------------------------------------------------------
            //  最大値チェック用
            //--------------------------------------------------------------------------------
            [Range(Max = "23:10")]
            public TimeSpan? MaxTimeSpan { get; set; }

            [Range(Max = "22:55", MaxErrorMessage ="最大変更")]　
            public TimeSpan? MaxErrTimeSpan { get; set; }

            //--------------------------------------------------------------------------------
            //  刻み幅チェック用
            //--------------------------------------------------------------------------------
            [Range(Step = 10)]
            public TimeSpan? StepTimeSpan { get; set; }

            [Range(Step = 300, StepErrorMessage ="ステップ変更")]
            public TimeSpan? StepErrTimeSpan { get; set; }

            [Range(Min = "2:00", Max = "22:22", Step = 900)]
            public TimeSpan? MinMaxStepTimeSpan { get; set; }
        }

        /// <summary>
        /// Get処理
        /// </summary>
        public void OnGet()
        {
            BindData.MinTimeSpan = TimeSpan.Parse("1:00");
            BindData.MinErrTimeSpan = TimeSpan.Parse("1:00");
            BindData.MaxTimeSpan = TimeSpan.Parse("23:15");
            BindData.MaxErrTimeSpan = TimeSpan.Parse("23:00");
            BindData.StepTimeSpan = TimeSpan.Parse("10:00:05");
            BindData.StepErrTimeSpan = TimeSpan.Parse("23:02");
            BindData.MinMaxStepTimeSpan = TimeSpan.Parse("12:34");
        }

        /// <summary>
        /// Post処理
        /// </summary>
        /// <returns></returns>
        public IActionResult OnPost()
        {
            return RedirectToPage("TimeInputResult", this.BindData);
        }
    }
}
