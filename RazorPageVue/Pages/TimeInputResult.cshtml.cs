using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace RazorPageVue.Pages
{
    public class TimeInputResultModel : PageModel
    {
        /// <summary>
        /// 基本のタイムスパン
        /// </summary>
        public TimeSpan? NormalTimeSpan { get; set; }

        public string NormalTimeString
        {
            get{
                return NormalTimeSpan == null ? "" : ((TimeSpan)NormalTimeSpan).ToString();
            }
        }

        /// <summary>
        /// 必須のタイムスパン
        /// </summary>
        public string RequiredTimeSpan { get; set; }

        /// <summary>
        /// 必須のタイムスパン
        /// </summary>
        public string RequiredTimeSpanChange { get; set; }

        public string MinTimeSpan { get; set; }

        public string MinErrTimeSpan { get; set; }

        public string MaxTimeSpan { get; set; }

        public string MaxErrTimeSpan { get; set; }

        public string StepTimeSpan { get; set; }

        public string StepErrTimeSpan { get; set; }

        public string MinMaxStepTimeSpan { get; set; }

        public void OnGet(TimeInputModel.InputModel model)
        {
            NormalTimeSpan = model.NormalTimeSpan;
            RequiredTimeSpan = ((TimeSpan)model.RequiredTimeSpan).ToString();
            RequiredTimeSpanChange = ((TimeSpan)model.RequiredTimeSpanChange).ToString();
            MinTimeSpan = ((TimeSpan)model.MinTimeSpan).ToString();
            MinErrTimeSpan = ((TimeSpan)model.MinErrTimeSpan).ToString();
            MaxTimeSpan = ((TimeSpan)model.MaxTimeSpan).ToString();
            MaxErrTimeSpan = ((TimeSpan)model.MaxErrTimeSpan).ToString();
            StepTimeSpan = ((TimeSpan)model.StepTimeSpan).ToString();
            StepErrTimeSpan = ((TimeSpan)model.StepErrTimeSpan).ToString();
            MinMaxStepTimeSpan = ((TimeSpan)model.MinMaxStepTimeSpan).ToString();
        }
    }
}
