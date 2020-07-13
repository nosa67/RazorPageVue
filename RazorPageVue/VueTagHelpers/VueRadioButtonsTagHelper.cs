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
    /// Vueで作ったVueRadioButtonコンポーネントをRazorで利用する為のタグヘルパー
    /// 以下のタグ属性を利用できるようにする
    /// asp-for：ラジオボタンの選択値
    /// asp-items: ラジオボタンのリスト（KeyValuePair＜string, string＞のリスト）enumの選択の場合は設定不要
    /// selectedclass:選択されているラジオボタンのCSSクラス（ボタンとテキストをくくったspanタグ）
    /// notselectedclass:未選択のラジオボタンのCSSクラス（ボタンとテキストをくくったspanタグ）
    /// [例]
    /// 　<vue-radio-buttons asp-for='@Model.SelectedList' asp-items='@Model.KeyValueList' selectedclass="has-background-primary"></radio-buttons>
    ///   ModelのSelectedListは選択されたチェックボタンのリストの初期値を設定し、選択した結果リストが設定される
    ///   Model.eyValueListはチェックボタンのリストをList＜KeyValuePair＜string,string＞＞型で設定する。（keyは表示する文字列、valueは設定される値）
    ///   ただし、SelectedListがEnum型の配列の場合、リストを空にしておくと自動的にEnumのリストが設定される。Enumのリストを加工したい場合のみ上記のリストを設定する
    /// </summary>
    [HtmlTargetElement("vue-radio-buttons", TagStructure = TagStructure.NormalOrSelfClosing)]
    public class VueRadioButtonsTagHelper : TagHelper
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
        /// コンストラクタ
        /// </summary>
        /// <param name="htmlHelper"></param>
        public VueRadioButtonsTagHelper(IHtmlHelper htmlHelper, IHtmlGenerator generator)
        {
            Generator = generator;
        }

        /// <summary>
        /// htmlヘルパーを利用するために関連付けるビューのコンテキスト
        /// </summary>
        [ViewContext]
        [HtmlAttributeNotBound]
        public ViewContext ViewContext { get; set; }

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

            // asp-forがEnum型でリストが未設定の場合はEnumのリストを作成する(Nullableの場合も対処している)
            if (AspFor.Metadata.ModelType.IsEnum)
            {
                if (AspItems == null)
                {
                    AspItems = new List<KeyValuePair<string, string>>();

                    foreach (var enumItemName in Enum.GetNames(AspFor.Metadata.ModelType))
                    {
                        AspItems.Add(new KeyValuePair<string, string>(enumItemName, enumItemName));
                    }
                }
            }
            else if (AspFor.Metadata.ModelType.IsGenericType && AspFor.Metadata.ModelType.GetGenericTypeDefinition() == typeof(Nullable<>))
            {
                if (AspItems == null)
                {
                    AspItems = new List<KeyValuePair<string, string>>();

                    foreach (var enumItemName in Enum.GetNames(AspFor.Metadata.ModelType.GenericTypeArguments[0]))
                    {
                        AspItems.Add(new KeyValuePair<string, string>(enumItemName, enumItemName));
                    }
                }
            }

            // 選択リストをJSONに変換して設定(Vueに配列を渡すにはv-bindを利用する必要がある)
            var serializer = new DataContractJsonSerializer(typeof(List<KeyValuePair<string, string>>));
            using (MemoryStream ms = new MemoryStream())
            {
                serializer.WriteObject(ms, AspItems);
                output.Attributes.SetAttribute("list", Encoding.UTF8.GetString(ms.ToArray()));
            }


            // テキストボックスのタグビルダーを作成し、バリデーションなどの属性で設定されているものをタグに取り込む
            // この時、すでに設定されているタグの属性は更新できないので注意
            output.MergeAttributes(GenerateRadioButton());
        }

        /// <summary>
        /// タグビルダーを作成
        /// </summary>
        /// <returns>標準のinputタグを利用したタグビルダー</returns>
        private TagBuilder GenerateRadioButton()
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
                AspFor.ModelExplorer.Model,
                null,
                htmlAttributes);
        }
    }
}
