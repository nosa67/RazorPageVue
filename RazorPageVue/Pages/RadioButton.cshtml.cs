using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RazorPageVue.VueValidations;
using System.Collections.Generic;

namespace RazorPageVue.Pages
{
    public class RadioButtonModel : PageModel
    {
        /// <summary>
        /// ラジオボタンの選択リスト
        /// </summary>
        static public List<KeyValuePair<string, string>> RadioValues
        {
            get
            {
                if (_radioValues == null)
                {
                    _radioValues = new List<KeyValuePair<string, string>>();
                    _radioValues.Add(new KeyValuePair<string, string>("第1項目", "1"));
                    _radioValues.Add(new KeyValuePair<string, string>("第2項目", "2"));
                    _radioValues.Add(new KeyValuePair<string, string>("第3項目", "3"));
                    _radioValues.Add(new KeyValuePair<string, string>("第4項目", "4"));
                    _radioValues.Add(new KeyValuePair<string, string>("最終項目", "5"));
                }
                return _radioValues;
            }
        }
        static List<KeyValuePair<string, string>> _radioValues = null;

        /// <summary>
        /// 結合データ
        /// </summary>
        [BindProperty]
        public InputModel BindData { get; set; } = new InputModel();

        public class InputModel
        {
            // ラジオボタンの選択結果
            public string RadioSelected { get; set; } = "2";

            public string RadioSelectedText { 
                get 
                {
                    foreach (var item in RadioValues)
                    {
                        if (item.Value == RadioSelected) return item.Key;
                    }
                    return "";
                } 
            }

            [Required]
            public string RadioRequiredSelected { get; set; }

            [Required(ErrorMessage ="必須変更")]
            public string RadioRequiredSelectedErrChange { get; set; }

            public string RadioRequiredSelectedText
            {
                get
                {
                    foreach (var item in RadioValues)
                    {
                        if (item.Value == RadioRequiredSelected) return item.Key;
                    }
                    return "";
                }
            }

            // Enumを利用したラジオボタンの選択結果
            public SampleEnum? EnumRadioSelected { get; set; } = SampleEnum.sample2;

            // Enumを利用したラジオボタンの選択結果
            [Required]
            public SampleEnum? EnumRequiredRadioSelected { get; set; } = null;

            [Required(ErrorMessage = "必須変更")]
            public SampleEnum? EnumRequiredRadioSelectedErrChange { get; set; }
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
            return RedirectToPage("RadioButtonResult", 
                new { SelectedId = BindData.RadioSelected, SelectedName = BindData.RadioSelectedText,
                    RequiredSelectedId = BindData.RadioRequiredSelected, RequiredSelectedName = BindData.RadioRequiredSelectedText,
                    SelectedEnum = BindData.EnumRadioSelected,
                    RequiredSelectedEnum = BindData.EnumRequiredRadioSelected
                });
        }
    }
}
