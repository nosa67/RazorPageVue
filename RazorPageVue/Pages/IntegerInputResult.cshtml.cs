using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace RazorPageVue.Pages
{
    public class IntegerInputResultModel : PageModel
    {
        #region 必須チェック用
        public int? Nochek { get; set; }
        public int? Required { get; set; }
        public int? RequiredErrch { get; set; }
        #endregion

        #region 最小値チェック
        public int? MinM5 { get; set; } = -6;
        public int? MinM5Errch { get; set; } = -6;
        public int? Min0 { get; set; } = -1;
        public int? Min2 { get; set; } = 0;
        #endregion

        #region 最大値チェック
        public int? Max5 { get; set; } = 6;
        public int? Max5Errch { get; set; } = 6;
        public int? Max0 { get; set; } = 1;
        public int? MaxM2 { get; set; } = 0;
        #endregion

        #region ステップチェック
        public int? Step2 { get; set; } = 1;
        public int? Step2Errch { get; set; } = 1;
        public int? Step3 { get; set; } = 1;
        #endregion

        #region 最小値と最大値の同時チェック
        public int? MinM10MaxM5 { get; set; } = -15;
        public int? MinM5Max0 { get; set; } = 1;
        public int? MinM5Max5 { get; set; } = 10;
        public int? Min0Max5 { get; set; } = -1;
        public int? Min5Max10 { get; set; } = 0;
        #endregion

        #region 最小値とステップの同時チェック
        public int? MinM5Step3 { get; set; } = -3;
        public int? Min0Step3 { get; set; } = -1;
        public int? Min2Step3 { get; set; } = 0;
        #endregion

        #region 最大値とステップの同時チェック
        public int? Max5Step2 { get; set; } = 6;
        public int? Max0Step3 { get; set; } = 1;
        public int? MaxM2Step4 { get; set; } = 0;
        #endregion

        #region 全ての条件設定
        public int? MinM5Step3Max5 { get; set; } = 6;
        public int? MinM10Step3MaxM5 { get; set; } = 6;
        public int? Min5Step3Max10 { get; set; } = 6;
        #endregion

        public void OnGet(IntegerInputModel.InputModel model)
        {
            Nochek = model.Nochek;
            Required = model.Required;
            RequiredErrch = model.RequiredErrch;
            MinM5 = model.MinM5;
            MinM5Errch = model.MinM5Errch;
            Min0 = model.Min0;
            Min2 = model.Min2;
            Max5 = model.Max5;
            Max5Errch = model.Max5Errch;
            Max0 = model.Max0;
            MaxM2 = model.MaxM2;
            Step2 = model.Step2;
            Step2Errch = model.Step2Errch;
            Step3 = model.Step3;
            MinM10MaxM5 = model.MinM10MaxM5;
            MinM5Max0 = model.MinM5Max0;
            MinM5Max5 = model.MinM5Max5;
            Min0Max5 = model.Min0Max5;
            Min5Max10 = model.Min5Max10;
            MinM5Step3 = model.MinM5Step3;
            Min0Step3 = model.Min0Step3;
            Min2Step3 = model.Min2Step3;
            Max5Step2 = model.Max5Step2;
            Max0Step3 = model.Max0Step3;
            MaxM2Step4 = model.MaxM2Step4;
            MinM5Step3Max5 = model.MinM5Step3Max5;
            MinM10Step3MaxM5 = model.MinM10Step3MaxM5;
            Min5Step3Max10 = model.Min5Step3Max10;
        }
    }
}
