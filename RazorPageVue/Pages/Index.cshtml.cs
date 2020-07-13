using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;
using System.Threading.Tasks;
using RazorPageVue.VueValidations;
using Microsoft.AspNetCore.Mvc;

namespace RazorPageVue.Pages
{
    /// <summary>
    /// テスト用列挙
    /// </summary>
    public enum SampleEnum
    {
        sample1,
        sample2,
        sample3,
        sampleOther
    };

    public class IndexModel : PageModel
    {
        /// <summary>
        /// ラジオボタンの選択リスト
        /// </summary>
        public List<KeyValuePair<string, string>> RadioValues { get; set; } = new List<KeyValuePair<string, string>>();

        /// <summary>
        /// 結合データ
        /// </summary>
        [BindProperty]
        public InputModel BindData { get; set; } = new InputModel();

        public class InputModel
        {
            // ラジオボタンの選択結果
            
            public string RadioSelected { get; set; } = "2";

            // Enumを利用したラジオボタンの選択結果
            public SampleEnum EnumRadioSelected { get; set; } = SampleEnum.sample2;

            /// <summary>
            /// 通常のチェックボックスの選択結果
            /// </summary>
            public List<string> CheckSelectedList { get; set; } = new List<string>() { "2" };

            /// <summary>
            /// Enumタイプのチェックボックスの選択
            /// </summary>
            public List<SampleEnum> EnumCheckSelectedList { get; set; } = new List<SampleEnum>() { SampleEnum.sample3 };

            #region ---------- テキスト入力用 ----------
            public string TextNocheck { get; set; } = "TextNocheck";

            [Required]
            public string TextRequired { get; set; } = "";

            [Required(ErrorMessage = "必須エラーメッセージ変更")]
            public string TextRequiredMsgChange { get; set; } = "";

            [StringLength(MinLength=5)]
            public string TextMinLength { get; set; } = "aaa";

            [StringLength(MinLength = 5,UnderMinErrorMessage ="最小文字数エラーメッセージ変更")]
            public string TextMinLengthMsg { get; set; } = "aaa";

            [StringLength(MaxLength = 10)]
            public string TextMaxLength { get; set; } = "aaaaaaaaaab";

            [StringLength(MaxLength = 10, OverMaxErrorMessage ="最大文字数エラーメッセージ変更")]
            public string TextMaxLengthMsg { get; set; } = "aaaaaaaaaab";

            [StringLength(MinLength = 5, MaxLength = 10)]
            public string TextMinMaxLength { get; set; } = "aaaaaaaaa";

            public string TextCompaire1 { get; set; } = "aaa";
            [Compare(CompareTarget = "TextCompaire1")]
            public string TextCompaire2 { get; set; } = "bbb";

            public string TextCompaireMsg1 { get; set; } = "aaa";
            [Compare(CompareTarget = "TextCompaireMsg1", ErrorMessage = "比較メッセージ変更")]
            public string TextCompaireMsg2 { get; set; } = "bbb";

            public string URL { get; set; }

            #endregion

            #region ---------- 整数 ----------
            public int? nochekInt { get; set; }

            [Required]
            public int? requiredInt { get; set; }

            [Required(ErrorMessage = "必須だよ（変更）")]
            public int? requiredErrChangeInt { get; set; }

            [Range(Min = -5)]
            public int? under5Int { get; set; } = -6;

            [Range(Min = -5, MinErrorMessage ="最小値より小さい（変更）")]
            public int? under5ErrChangeInt { get; set; } = -6;

            [Range(Min = -5, Step = 3)]
            public int? under5Step3Int { get; set; } = -3;

            [Range(Min = -5, Step = 3, StepErrorMessage = "刻み幅になってない（変更）")]
            public int? under5Step3ErrChangeInt { get; set; } = -3;

            [Range(Max = 5)]
            public int? over5Int { get; set; } = 6;

            [Range(Max = 5, MaxErrorMessage = "最大値超えてる（変更）")]
            public int? over5ErrChangeInt { get; set; } = 6;
            #endregion 

            #region ---------- 実数 ----------
            public double? nochekDouble { get; set; }

            [Required]
            public double? requiredDouble { get; set; }

            [Required(ErrorMessage = "必須だよ（変更）")]
            public double? requiredErrChangeDouble { get; set; }

            [Range(Min = -0.5)]
            public double? under5Double { get; set; } = -6;

            [Range(Min = -0.5, MinErrorMessage = "最小値より小さい（変更）")]
            public double? under5ErrChangeDouble { get; set; } = -0.6;

            [Range(Min = -0.5, Step = 0.3, Max=1.2)]
            public double? under5Step3Max12Double { get; set; } = -0.3;

            [Range(Min = -0.5, Step = 0.3, Max = 1.2, StepErrorMessage = "刻み幅になってない（変更）")]
            public double? under5Step3Max12ErrChangeDouble { get; set; } = -3;

            [Range(Max = 0.5)]
            public double? over5Double { get; set; } = 0.6;

            [Range(Max = 0.5, MaxErrorMessage = "最大値超えてる（変更）")]
            public double? over5ErrChangeDouble { get; set; } = 0.6;
            #endregion
        }

        /// <summary>
        /// コンストラクタ
        /// </summary>
        public IndexModel()
        {
            setRadiList();  // ラジオボタン用選択リストを設定
        }

        /// <summary>
        /// Get処理
        /// </summary>
        public void OnGet()
        {
        }

        /// <summary>
        /// Post処理
        /// </summary>
        /// <returns></returns>
        public IActionResult OnPost()
        {
            return Page();
        }

        /// <summary>
        /// 選択用リストの初期化
        /// </summary>
        void setRadiList()
        {
            RadioValues.Add(new KeyValuePair<string, string>("第1項目", "1"));
            RadioValues.Add(new KeyValuePair<string, string>("第2項目", "2"));
            RadioValues.Add(new KeyValuePair<string, string>("第3項目", "3"));
            RadioValues.Add(new KeyValuePair<string, string>("第4項目", "4"));
            RadioValues.Add(new KeyValuePair<string, string>("最終項目", "5"));
        }
    }
}
