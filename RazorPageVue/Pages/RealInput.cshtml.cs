using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RazorPageVue.VueValidations;

namespace RazorPageVue.Pages
{
    public class RealInputModel : PageModel
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
            public double? Nochek { get; set; }

            /// <summary>
            /// 入力必須
            /// </summary>
            [Required]
            public double? Required { get; set; }

            /// <summary>
            /// 入力必須（エラーメッセージ変更）
            /// </summary>
            [Required(ErrorMessage = "必須だよ（変更）")]
            public double? RequiredErrch { get; set; }
            #endregion

            #region 最小値チェック
            /// <summary>
            /// 最小値-5
            /// </summary>
            [Range(Min = -1.5)]
            public double? MinM1_5 { get; set; } = -1.6;

            /// <summary>
            /// 最小値-5 エラーメッセージ変更
            /// </summary>
            [Range(Min = -1.5, MinErrorMessage = "最小値より小さい（変更）")]
            public double? MinM1_5Errch { get; set; } = -1.7;

            /// <summary>
            /// 最小値 0
            /// </summary>
            [Range(Min = 0)]
            public double? Min0 { get; set; } = -1;

            /// <summary>
            /// 最小値 2
            /// </summary>
            [Range(Min = 1.2)]
            public double? Min1_2 { get; set; } = 0;
            #endregion

            #region 最大値チェック
            /// <summary>
            /// 最大値 5
            /// </summary>
            [Range(Max = 1.5)]
            public double? Max1_5 { get; set; } = 2.6;

            /// <summary>
            /// 最大値 5 エラーメッセージ変更
            /// </summary>
            [Range(Max = 1.5, MaxErrorMessage = "最大値超えてる（変更）")]
            public double? Max1_5Errch { get; set; } = 1.6;

            /// <summary>
            /// 最大値 0
            /// </summary>
            [Range(Max = 0)]
            public double? Max0 { get; set; } = 1.1;

            /// <summary>
            /// 最大値 -2
            /// </summary>
            [Range(Max = -1.2)]
            public double? MaxM1_2 { get; set; } = -1.1;
            #endregion

            #region ステップチェック
            /// <summary>
            /// ステップ 2
            /// </summary>
            [Range(Step = 0.2)]
            public double? Step0_2 { get; set; } = 0.1;

            /// <summary>
            /// ステップ 2 エラーメッセージ変更
            /// </summary>
            [Range(Step = 0.2, StepErrorMessage = "ステップエラー変更")]
            public double? Step0_2Errch { get; set; } = 0.1;

            /// <summary>
            /// ステップ 3
            /// </summary>
            [Range(Step = 0.3)]
            public double? Step0_3 { get; set; } = 1.0;
            #endregion

            #region 最小値と最大値の同時チェック
            [Range(Min = -1.0, Max = -0.5)]
            public double? MinM1_0MaxM0_5 { get; set; } = -1.5;

            [Range(Min = -0.5, Max = 0)]
            public double? MinM0_5Max0 { get; set; } = 1.0;

            [Range(Min = -0.5, Max = 0.5)]
            public double? MinM0_5Max0_5 { get; set; } = 1.0;

            [Range(Min = 0, Max = 0.5)]
            public double? Min0Max0_5 { get; set; } = -1.0;

            [Range(Min = 0.5, Max = 1.0)]
            public double? Min0_5Max1_0 { get; set; } = 0;
            #endregion

            #region 最小値とステップの同時チェック
            [Range(Min = -1.5, Step = 0.3)]
            public double? MinM1_5Step0_3 { get; set; } = -1.3;

            [Range(Min = 0, Step = 0.3)]
            public double? Min0Step0_3 { get; set; } = -0.1;

            [Range(Min = 1.2, Step = 0.3)]
            public double? Min1_2Step0_3 { get; set; } = 0;
            #endregion

            #region 最大値とステップの同時チェック
            [Range(Max = 0.5, Step = 0.2)]
            public double? Max0_5Step0_2 { get; set; } = 0.6;

            [Range(Max = 0, Step = 0.3)]
            public double? Max0Step0_3 { get; set; } = 0.1;

            [Range(Max = -1.2, Step = 0.4)]
            public double? MaxM1_2Step0_4 { get; set; } = 0;
            #endregion

            #region 全ての条件設定
            /// <summary>
            /// 最小値 -5 最大値 5 ステップ 3
            /// </summary>
            [Range(Min = -0.5, Max = 0.5, Step = 0.3)]
            public double? MinM0_5Step0_3Max0_5 { get; set; } = 0.6;
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
            return RedirectToPage("RealInputResult", this.BindData);
        }

    }
}
