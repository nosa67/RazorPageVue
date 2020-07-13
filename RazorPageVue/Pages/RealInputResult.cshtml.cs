using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace RazorPageVue.Pages
{
    public class RealInputResultModel : PageModel
    {
        #region 必須チェック用
        public double? Nochek { get; set; }
        public double? Required { get; set; }
        public double? RequiredErrch { get; set; }
        #endregion

        #region 最小値チェック
        public double? MinM1_5 { get; set; } = -1.6;
        public double? MinM1_5Errch { get; set; } = -3.6;
        public double? Min0 { get; set; } = -1;
        public double? Min1_2 { get; set; } = 0;
        #endregion

        #region 最大値チェック
        public double? Max1_5 { get; set; } = 2.6;
        public double? Max1_5Errch { get; set; } = 1.6;
        public double? Max0 { get; set; } = 1.1;
        public double? MaxM1_2 { get; set; } = -1.1;
        #endregion

        #region ステップチェック
        public double? Step0_2 { get; set; } = 0.1;
        public double? Step0_2Errch { get; set; } = 0.1;
        public double? Step0_3 { get; set; } = 1.0;
        #endregion

        #region 最小値と最大値の同時チェック
        public double? MinM1_0MaxM0_5 { get; set; } = -1.5;
        public double? MinM0_5Max0 { get; set; } = 1.0;
        public double? MinM0_5Max0_5 { get; set; } = 1.0;
        public double? Min0Max0_5 { get; set; } = -1.0;
        public double? Min0_5Max1_0 { get; set; } = 0;
        #endregion

        #region 最小値とステップの同時チェック
        public double? MinM1_5Step0_3 { get; set; } = -1.3;
        public double? Min0Step0_3 { get; set; } = -0.1;
        public double? Min1_2Step0_3 { get; set; } = 0;
        #endregion

        #region 最大値とステップの同時チェック
        public double? Max0_5Step0_2 { get; set; } = 0.6;
        public double? Max0Step0_3 { get; set; } = 0.1;
        public double? MaxM1_2Step0_4 { get; set; } = 0;
        #endregion

        #region 全ての条件設定
        public double? MinM0_5Step0_3Max0_5 { get; set; } = 0.6;
        #endregion


        public void OnGet(RealInputModel.InputModel model)
        {
            Nochek = model.Nochek;
            Required = model.Required;
            RequiredErrch = model.RequiredErrch;
            MinM1_5 = model.MinM1_5;
            MinM1_5Errch = model.MinM1_5Errch;
            Min0 = model.Min0;
            Min1_2 = model.Min1_2;
            Max1_5 = model.Max1_5;
            Max1_5Errch = model.Max1_5Errch;
            Max0 = model.Max0;
            MaxM1_2 = model.MaxM1_2;
            Step0_2 = model.Step0_2;
            Step0_2Errch = model.Step0_2Errch;
            Step0_3 = model.Step0_3;
            MinM1_0MaxM0_5 = model.MinM1_0MaxM0_5;
            MinM0_5Max0 = model.MinM0_5Max0;
            MinM0_5Max0_5 = model.MinM0_5Max0_5;
            Min0Max0_5 = model.Min0Max0_5;
            Min0_5Max1_0 = model.Min0_5Max1_0;
            MinM1_5Step0_3 = model.MinM1_5Step0_3;
            Min0Step0_3 = model.Min0Step0_3;
            Min1_2Step0_3 = model.Min1_2Step0_3;
            Max0_5Step0_2 = model.Max0_5Step0_2;
            Max0Step0_3 = model.Max0Step0_3;
            MaxM1_2Step0_4 = model.MaxM1_2Step0_4;
            MinM0_5Step0_3Max0_5 = model.MinM0_5Step0_3Max0_5;
        }
    }
}
