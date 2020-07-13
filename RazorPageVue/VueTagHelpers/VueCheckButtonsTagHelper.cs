using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Text;

namespace RazorPageVue.VueTagHelpers
{
    /// <summary>
    /// Vueで作ったVueCheckButtonコンポーネントをRazorで利用する為のタグヘルパー
    /// 以下のタグ属性を利用できるようにする
    /// asp-for：チェックボタンの選択リスト
    /// asp-items: チェックボタンのリスト（KeyValuePair＜string, string＞のリスト）enumの選択の場合は設定不要
    /// selectedclass:選択されているラジオボタンのCSSクラス（ボタンとテキストをくくったspanタグ）
    /// notselectedclass:未選択のラジオボタンのCSSクラス（ボタンとテキストをくくったspanタグ）
    /// [例]
    /// 　<vue-check-buttons asp-for='@Model.RadioSelected' asp-items='@Model.RadioKeyValueList' selectedclass="has-background-primary"></radio-buttons>
    ///   ModelのRadioSelectedは選択されたラジオボタンの値が設定される
    ///   Model.RadioKeyValueListはラジオボタンのリストをList＜KeyValuePair＜string,string＞＞型で設定する。（keyは表示する文字列、valueは設定される値）
    ///   ただし、RadioSelectedがEnum型の場合、リストを空にしておくと自動的にEnumのリストが設定される。Enumのリストを加工したい場合のみ上記のリストを設定する
    ///   なお、Enumの場合、Nullable（null許容型）にしていないと、Required未設定でも結果が空にはならないので注意
    /// </summary>
    [HtmlTargetElement("vue-check-buttons", TagStructure = TagStructure.NormalOrSelfClosing)]
    public class VueCheckButtonsTagHelper : TagHelper
    {
        /// <summary>
        /// asp-for属性が入るプロパティ
        /// </summary>
        public ModelExpression AspFor { get; set; }

        /// <summary>
        /// タグ属性「name」を受け取るプロパティ。（未設定で「asp-for」が設定されている場合はその変数を示す値が設定される）
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// ラジオボタンのリスト(asp-items)
        /// kKeyValuePairのリストで、keyが表示される文字列で、valueが設定される値になる
        /// </summary>
        public List<KeyValuePair<string, string>> AspItems { get; set; }

        /// <summary>
        /// バリデーターの処理を実施させる為に設定するテキストボックス用のジェネレータ作成用
        /// （コンストラクタのデータインジェクションで設定）
        /// </summary>
        protected IHtmlGenerator Generator { get; }

        /// <summary>
        /// htmlヘルパーを利用するために関連付けるビューのコンテキスト
        /// </summary>
        [ViewContext]
        [HtmlAttributeNotBound]
        public ViewContext ViewContext { get; set; }

        /// <summary>
        /// コンストラクタ
        /// </summary>
        /// <param name="htmlHelper"></param>
        public VueCheckButtonsTagHelper(IHtmlHelper htmlHelper, IHtmlGenerator generator)
        {
            Generator = generator;
        }

        /// <summary>
        /// タグの調整処理
        /// </summary>
        /// <param name="context"></param>
        /// <param name="output"></param>
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            // 引数のコンテキストと出力がnullならエラー
            if (context == null) throw new ArgumentNullException(nameof(context));
            if (output == null) throw new ArgumentNullException(nameof(output));

            //// RazorPageでPost時にモデルにバインドできるように、Vueのid,name,valueプロパティを設定
            //output.Attributes.SetAttribute("name", AspFor.Name);

            // asp-forがEnum型でリストが未設定の場合はEnumのリストを作成する
            if (AspFor.Metadata.ModelType.GenericTypeArguments[0].IsEnum)
            {
                if (AspItems == null)
                {
                    AspItems = new List<KeyValuePair<string, string>>();

                    foreach (var enumItemName in Enum.GetNames(AspFor.Metadata.ModelType.GenericTypeArguments[0]))
                    {
                        AspItems.Add(new KeyValuePair<string, string>(enumItemName, ((int)Enum.Parse(AspFor.Metadata.ModelType.GenericTypeArguments[0],enumItemName)).ToString()));
                    }
                }
            }

            // 選択リストをJSONに変換して設定
            var serializer = new DataContractJsonSerializer(typeof(List<KeyValuePair<string, string>>));
            using (MemoryStream ms = new MemoryStream())
            {
                serializer.WriteObject(ms, AspItems);
                output.Attributes.SetAttribute("list", Encoding.UTF8.GetString(ms.ToArray()));
            }

            // 選択結果リストを設定
            var jsonValueList = "";
            if (AspFor.Metadata.ModelType.GenericTypeArguments[0].IsEnum)
            {
                // Enumの場合は一旦文字列リストに変換してからJSON形式にして設定する
                var workList = new List<string>();
                foreach (var item in (System.Collections.IEnumerable)AspFor.Model) workList.Add(((int)item).ToString());

                serializer = new DataContractJsonSerializer(typeof(List<string>));
                using (MemoryStream ms = new MemoryStream())
                {
                    serializer.WriteObject(ms, workList);
                    jsonValueList = Encoding.UTF8.GetString(ms.ToArray());
                    //output.Attributes.SetAttribute("v-bind:value", Encoding.UTF8.GetString(ms.ToArray()));
                }
            }
            else
            {
                // Enum以外の場合は文字列リストをJSON形式にして設定する
                serializer = new DataContractJsonSerializer(typeof(List<string>));
                using (MemoryStream ms = new MemoryStream())
                {
                    serializer.WriteObject(ms, AspFor.Model);
                    jsonValueList = Encoding.UTF8.GetString(ms.ToArray());
                    //output.Attributes.SetAttribute("v-bind:value", Encoding.UTF8.GetString(ms.ToArray()));
                }
            }

            //base.Process(context, output);
            // テキストボックスのタグビルダーを作成し、バリデーションなどの属性で設定されているものをタグに取り込む
            // この時、すでに設定されているタグの属性は更新できないので注意
            output.MergeAttributes(GenerateRadioButton(jsonValueList));
        }

        /// <summary>
        /// タグビルダーを作成
        /// </summary>
        /// <returns>標準のinputタグを利用したタグビルダー</returns>
        private TagBuilder GenerateRadioButton(string value)
        {

            // このタグで設定する属性リストを作成（NameがあってAspForが無い場合にNameが直接書かれていればそれを設定している）
            IDictionary<string, object> htmlAttributes = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);
            if (string.IsNullOrEmpty(AspFor.Name) &&
                string.IsNullOrEmpty(ViewContext.ViewData.TemplateInfo.HtmlFieldPrefix))
            {
                if (!string.IsNullOrEmpty(Name))
                {
                    htmlAttributes.Add("name", Name);
                }
            }
            else
            {
                htmlAttributes = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);
            }

            // inputの基本的なタグビルダーを生成して返す
            return Generator.GenerateTextBox(
                ViewContext,
                AspFor.ModelExplorer,
                AspFor.Name,
                //AspFor.ModelExplorer.Model,
                value,
                null,
                htmlAttributes);
        }
    }
}
