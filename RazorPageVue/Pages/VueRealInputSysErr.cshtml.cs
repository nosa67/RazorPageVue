using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RazorPageVue.VueValidations;

namespace RazorPageVue.Pages
{
    public class VueRealInputSysErrModel : PageModel
    {
        /// <summary>
        /// 結合データ
        /// </summary>
        [BindProperty]
        public InputModel BindData { get; set; } = new InputModel();

        public class InputModel
        {
            // 範囲未指定の各タイプの数値
            public float? normalFloat { get; set; }
            public double? normalDouble { get; set; }

            // 正常範囲の各タイプの数値
            [Range(Min = -3.402823e38, Max = 3.402823e38)]
            public float? normalRangeFloat { get; set; }
            [Range(Min = -1.79769313486231e308, Max = 1.79769313486231e308)]
            public double? normalRangeDouble { get; set; }

            // 範囲指定が異常な各タイプの数値（エラーにならないで無視される）
            //[Range(Min = "A", Max = "B")]
            public float? illegalRangeAttrFloat { get; set; }
            //[Range(Min = "A", Max = "B")]
            public double? illegalRangeAttrDouble { get; set; }

            // タグに直接書いた範囲指定が異常な各タイプの数値
            public float? illegalRangeFloat { get; set; }
            public double? illegalRangeDouble { get; set; }

            // 最小値が下回っている各タイプの数値
            [Range(Min = -3.402824e38, Max = 3.402823e38)]
            public float? underRangeFloat { get; set; }
            //[Range(Min = -1.79769313486232e308, Max = 1.79769313486231e308)] //このレンジ指定はそもそもコンパイルエラーとなる
            //public double? underRangeDouble { get; set; }

            // 最大値が上回っている各タイプの数値
            [Range(Min = -3.402823e38, Max = 1283.402823e38)]
            public float? overRangeFloat { get; set; }
            //[Range(Min = -1.79769313486231e308, Max = 1.79769313486232e308)] //このレンジ指定はそもそもコンパイルエラーとなる
            //public double? overRangeDouble { get; set; }
        }

        public void OnGet()
        {
        }
    }
}
