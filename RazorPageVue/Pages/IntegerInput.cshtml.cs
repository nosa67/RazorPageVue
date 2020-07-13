using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;
using System.Threading.Tasks;
using RazorPageVue.VueValidations;
using Microsoft.AspNetCore.Mvc;

namespace RazorPageVue.Pages
{
    public class IntegerInputModel : PageModel
    {
        /// <summary>
        /// 結合データ
        /// </summary>
        [BindProperty]
        public InputModel BindData { get; set; } = new InputModel();

        public class InputModel
        {
            #region 必須チェック用
            /// <summary>
            /// 必須条件なし
            /// </summary>
            public int? Nochek { get; set; }

            /// <summary>
            /// 入力必須
            /// </summary>
            [Required]
            public int? Required { get; set; }

            /// <summary>
            /// 入力必須（エラーメッセージ変更）
            /// </summary>
            [Required(ErrorMessage = "必須だよ（変更）")]
            public int? RequiredErrch { get; set; }
            #endregion

            #region 最小値チェック
            /// <summary>
            /// 最小値-5
            /// </summary>
            [Range(Min = -5)]
            public int? MinM5 { get; set; } = -6;

            /// <summary>
            /// 最小値-5 エラーメッセージ変更
            /// </summary>
            [Range(Min = -5, MinErrorMessage = "最小値より小さい（変更）")]
            public int? MinM5Errch { get; set; } = -6;

            /// <summary>
            /// 最小値 0
            /// </summary>
            [Range(Min = 0)]
            public int? Min0 { get; set; } = -1;

            /// <summary>
            /// 最小値 2
            /// </summary>
            [Range(Min = 2)]
            public int? Min2 { get; set; } = 0;
            #endregion

            #region 最大値チェック
            /// <summary>
            /// 最大値 5
            /// </summary>
            [Range(Max = 5)]
            public int? Max5 { get; set; } = 6;

            /// <summary>
            /// 最大値 5 エラーメッセージ変更
            /// </summary>
            [Range(Max = 5, MaxErrorMessage = "最大値超えてる（変更）")]
            public int? Max5Errch { get; set; } = 6;

            /// <summary>
            /// 最大値 0
            /// </summary>
            [Range(Max = 0)]
            public int? Max0 { get; set; } = 1;

            /// <summary>
            /// 最大値 -2
            /// </summary>
            [Range(Max = -2)]
            public int? MaxM2 { get; set; } = 0;
            #endregion

            #region ステップチェック
            /// <summary>
            /// ステップ 2
            /// </summary>
            [Range(Step = 2)]
            public int? Step2 { get; set; } = 1;

            /// <summary>
            /// ステップ 2 エラーメッセージ変更
            /// </summary>
            [Range(Step = 2, StepErrorMessage = "ステップエラー変更")]
            public int? Step2Errch { get; set; } = 1;

            /// <summary>
            /// ステップ 3
            /// </summary>
            [Range(Step = 3)]
            public int? Step3 { get; set; } = 1;
            #endregion

            #region 最小値と最大値の同時チェック
            [Range(Min = -10, Max = -5)]
            public int? MinM10MaxM5 { get; set; } = -15;

            [Range(Min = -5, Max = 0)]
            public int? MinM5Max0 { get; set; } = 1;

            [Range(Min = -5, Max = 5)]
            public int? MinM5Max5 { get; set; } = 10;

            [Range(Min = 0, Max = 5)]
            public int? Min0Max5 { get; set; } = -1;

            [Range(Min = 5, Max = 10)]
            public int? Min5Max10 { get; set; } = 0;
            #endregion

            #region 最小値とステップの同時チェック
            [Range(Min = -5, Step = 3)]
            public int? MinM5Step3 { get; set; } = -3;

            [Range(Min = 0, Step = 3)]
            public int? Min0Step3 { get; set; } = -1;

            [Range(Min = 2, Step = 3)]
            public int? Min2Step3 { get; set; } = 0;
            #endregion

            #region 最大値とステップの同時チェック
            [Range(Max = 5,Step =2)]
            public int? Max5Step2 { get; set; } = 6;

            [Range(Max = 0, Step = 3)]
            public int? Max0Step3 { get; set; } = 1;

            [Range(Max = -2, Step = 4)]
            public int? MaxM2Step4 { get; set; } = 0;
            #endregion

            #region 全ての条件設定
            /// <summary>
            /// 最小値 -5 最大値 5 ステップ 3
            /// </summary>
            [Range(Min = -5, Max = 5, Step = 3)]
            public int? MinM5Step3Max5 { get; set; } = 6;

            /// <summary>
            /// 最小値 -10 最大値 -5 ステップ 3
            /// </summary>
            [Range(Min = -10, Max = -5, Step = 3)]
            public int? MinM10Step3MaxM5 { get; set; } = -15;

            /// <summary>
            /// 最小値 -5 最大値 5 ステップ 3
            /// </summary>
            [Range(Min = 5, Max =10, Step = 3)]
            public int? Min5Step3Max10 { get; set; } = 15;
            #endregion
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
            return RedirectToPage("IntegerInputResult", this.BindData);
        }
    }
}
