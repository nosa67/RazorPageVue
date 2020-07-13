using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RazorPageVue.VueValidations;

namespace RazorPageVue.Pages
{
    public class CheckButtonModel : PageModel
    {
        /// <summary>
        /// ラジオボタンの選択リスト
        /// </summary>
        public List<KeyValuePair<string, string>> CheckValues { get; set; } = new List<KeyValuePair<string, string>>();

        /// <summary>
        /// 結合データ
        /// </summary>
        [BindProperty]
        public InputModel BindData { get; set; } = new InputModel();

        public class InputModel
        {
            /// <summary>
            /// 通常のチェックボックスの選択結果
            /// </summary>
            public List<string> NormalCheckList { get; set; } = new List<string>();

            /// <summary>
            /// 入力必須のチェックボックスの選択結果
            /// </summary>
            [Required]
            public List<string> RequiredCheckList { get; set; } = new List<string>();

            /// <summary>
            /// 入力必須のエラーメッセージ変更チェックボックスの選択結果
            /// </summary>
            [Required(ErrorMessage = "必須変更")]
            public List<string> RequiredErrChangeList { get; set; } = new List<string>();

            /// <summary>
            /// Enumタイプのチェックボックスの選択
            /// </summary>
            public List<SampleEnum> NormalEnumList { get; set; } = new List<SampleEnum>();

            /// <summary>
            /// 入力必須のEnumタイプのチェックボックスの選択
            /// </summary>
            [Required]
            public List<SampleEnum> RequiredEnumList { get; set; } = new List<SampleEnum>();

            /// <summary>
            /// 入力必須のエラーメッセージ変更Enumタイプのチェックボックスの選択
            /// </summary>
            [Required(ErrorMessage = "必須変更")]
            public List<SampleEnum> RequiredErrChangeEnumList { get; set; } = new List<SampleEnum>();
        }

        public CheckButtonModel()
        {
            setCheckList();
        } 

        public void OnGet()
        {
            BindData.NormalCheckList = new List<string>() { "2" };
            BindData.NormalEnumList = new List<SampleEnum>() { SampleEnum.sample3 };
        }

        /// <summary>
        /// Post処理
        /// </summary>
        /// <returns></returns>
        public IActionResult OnPost()
        {
            return RedirectToPage("CheckButtonResult",
                new {
                    normalCheckList = BindData.NormalCheckList,
                    requiredCheckList = BindData.RequiredCheckList,
                    requiredErrChangeList = BindData.RequiredErrChangeList,
                    normalEnumList = BindData.NormalEnumList,
                    requiredEnumList = BindData.RequiredEnumList,
                    requiredErrChangeEnumList = BindData.RequiredErrChangeEnumList
                });
        }

        /// <summary>
        /// 選択用リストの初期化
        /// </summary>
        void setCheckList()
        {
            CheckValues.Add(new KeyValuePair<string, string>("第1項目", "1"));
            CheckValues.Add(new KeyValuePair<string, string>("第2項目", "2"));
            CheckValues.Add(new KeyValuePair<string, string>("第3項目", "3"));
            CheckValues.Add(new KeyValuePair<string, string>("第4項目", "4"));
            CheckValues.Add(new KeyValuePair<string, string>("最終項目", "5"));
        }

    }
}
