using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;
using System.Linq;

namespace RazorPageVue.Pages
{
    public class CheckButtonResultModel : PageModel
    {
        /// <summary>
        /// ラジオボタンの選択リスト
        /// </summary>
        public Dictionary<string, string> CheckValues { get; set; } = new Dictionary<string, string>();

        /// <summary>
        /// 通常のチェックボックスの選択結果
        /// </summary>
        public string NormalCheckList { get; set; }

        /// <summary>
        /// 必須のチェックボックスの選択結果
        /// </summary>
        public string RequiredCheckList { get; set; }

        /// <summary>
        /// 必須でエラーメッセージ変更のチェックボックスの選択結果
        /// </summary>
        public string RequiredErrChangeList { get; set; }

        /// <summary>
        /// Enumタイプのチェックボックスの選択
        /// </summary>
        public string NormalEnumList { get; set; }

        /// <summary>
        /// 必須のEnumタイプのチェックボックスの選択
        /// </summary>
        public string RequiredEnumList { get; set; }

        /// <summary>
        /// 必須でエラーメッセージ変更のEnumタイプのチェックボックスの選択
        /// </summary>
        public string RequiredErrChangeEnumList { get; set; }

        public void OnGet(IEnumerable<string> normalCheckList, IEnumerable<string> requiredCheckList, IEnumerable<string> requiredErrChangeList,
            IEnumerable<SampleEnum> normalEnumList, IEnumerable<SampleEnum> requiredEnumList, IEnumerable<SampleEnum> requiredErrChangeEnumList)
        {
            setCheckList();

            NormalCheckList = getSelectedList(normalCheckList);
            RequiredCheckList = getSelectedList(requiredCheckList);
            RequiredErrChangeList = getSelectedList(requiredErrChangeList);

            NormalEnumList = getEnumSelectedList(normalEnumList);
            RequiredEnumList = getEnumSelectedList(requiredEnumList);
            RequiredErrChangeEnumList = getEnumSelectedList(requiredErrChangeEnumList);
        }

        string getSelectedList(IEnumerable<string> selectedList)
        {
            var list = "";

            if ((selectedList != null) && (selectedList.Count() > 0))
            {
                foreach (var item in selectedList)
                {
                    list += "," + item + ":" + CheckValues[item];
                }
                return list.Substring(1);
            }
            else
            {
                return "未選択";
            }
        }

        string getEnumSelectedList(IEnumerable<SampleEnum> enumSelectedList)
        {
            var list = "";

            if ((enumSelectedList != null) && (enumSelectedList.Count() > 0))
            {
                foreach (var item in enumSelectedList)
                {
                    list += "," + item.ToString();
                }
                return list.Substring(1);
            }
            else
            {
                return "未選択";
            }
        }

        /// <summary>
        /// 選択用リストの初期化
        /// </summary>
        void setCheckList()
        {
            CheckValues.Add("1", "第1項目");
            CheckValues.Add("2", "第2項目");
            CheckValues.Add("3", "第3項目");
            CheckValues.Add("4", "第4項目");
            CheckValues.Add("5", "第5項目");
        }
    }
}
