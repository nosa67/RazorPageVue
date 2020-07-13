using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.ViewFeatures.Internal;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;

namespace RazorPageVue.VueTagHelpers
{
    public class VueInputTagHelper : TagHelper
    {
        /// <summary>
        /// バインド対象のcshtmlのタグの属性名
        /// </summary>
        protected const string ForAttributeName = "asp-for";

        /// <summary>
        /// type属性に設定する値（空ならデータ型に合わせて設定される）
        /// </summary>
        protected string _overrideType = null;

        /// <summary>
        /// バインド対象取得用のプロパティ。HtmlAttributeNameの引数名のタグ属性名が対象となる
        /// </summary>
        [HtmlAttributeName(ForAttributeName)]
        public ModelExpression For { get; set; }

        /// <summary>
        /// タグ属性「name」を受け取るプロパティ。（バインド対象が未設定の場合に出力するタグのname属性の値になる）
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// タグ属性「value」を受け取るプロパティ。（バインド対象が未設定の場合に出力するタグのvalue属性の値になる）
        /// </summary>
        public string Value { get; set; }

        /// <summary>
        /// ビューのコンテキスト
        /// </summary>
        [HtmlAttributeNotBound]
        [ViewContext]
        public ViewContext ViewContext { get; set; }

        /// <summary>
        /// バリデーターの処理を実施させる為に設定するテキストボックス用のジェネレータ作成用
        /// （コンストラクタのデータインジェクションで設定）
        /// </summary>
        protected IHtmlGenerator Generator { get; }

        /// <summary>
        /// コンストラクタ
        /// </summary>
        /// <param name="generator">The <see cref="IHtmlGenerator"/>.</param>
        public VueInputTagHelper(IHtmlGenerator generator)
        {
            Generator = generator;
        }

        /// <summary>
        /// タグヘルパーの実行実装
        /// </summary>
        /// <param name="context">タグヘルパーコンテキスト</param>
        /// <param name="output">タグヘルパー出力</param>
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            // 引数のコンテキストと出力がnullならエラー
            if (context == null) throw new ArgumentNullException(nameof(context));
            if (output == null) throw new ArgumentNullException(nameof(output));

            // テキストボックスのタグビルダーを作成し、バリデーションなどの属性で設定されているものをタグに取り込む
            // この時、すでに設定されているタグの属性は更新できないので注意
            output.MergeAttributes(GenerateTextBox(Value));
        }

        /// <summary>
        /// テキストボックスのタグビルダーを作成
        /// </summary>
        /// <param name="value">タグのvalueに設定されている値（無ければnull）</param>
        /// <returns>標準のinputタグに近いタグビルダー</returns>
        protected TagBuilder GenerateTextBox(object value)
        {
            var modelExplorer = For.ModelExplorer;
            IDictionary<string, object> htmlAttributes = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);

            // typeはforまたはプレフィックスが設定されていて_overrideTypeが設定され手入れば設定する。
            // これを利用して継承クラスからtypeを設定できるようにしている
            if (!string.IsNullOrEmpty(_overrideType))　htmlAttributes.Add("type", _overrideType);

            // asp-forが設定されているかどうかでnameとvalueの異なるタグビルダーを作成
            if (string.IsNullOrEmpty(For.Name) &&
                string.IsNullOrEmpty(ViewContext.ViewData.TemplateInfo.HtmlFieldPrefix))
            {
                // asp-forが未設定の場合、nameやvalueに設定されている値でタグを作成
                return Generator.GenerateTextBox(
                    ViewContext,
                    modelExplorer,
                    Name,
                    value,
                    null,
                    htmlAttributes);
            }
            else
            {
                // asp-forが設定されている場合、nameやvalueはasp-forの内容に強制される
                return Generator.GenerateTextBox(
                    ViewContext,
                    modelExplorer,
                    For.Name,
                    modelExplorer.Model,
                    null,
                    htmlAttributes);
            }
        }

        /// <summary>
        /// 入力するデータの型のヒントリストを取得する
        /// 基本的に「InputTagHelper」の実装をそのまま利用している
        /// </summary>
        /// <returns>バインドしているデータ型のヒントリスト</returns>
        protected IEnumerable<string> GetInputValueTypeHints()
        {
            var modelExplorer = For.ModelExplorer;

            // テンプレートヒントが有ればそれをリストにして返す
            if (!string.IsNullOrEmpty(modelExplorer.Metadata.TemplateHint))
            {
                yield return modelExplorer.Metadata.TemplateHint;
            }

            // データタイプ名が有ればそれをそれをリストにして返す
            if (!string.IsNullOrEmpty(modelExplorer.Metadata.DataTypeName))
            {
                yield return modelExplorer.Metadata.DataTypeName;
            }

            // In most cases, we don't want to search for Nullable<T>. We want to search for T, which should handle
            // both T and Nullable<T>. However we special-case bool? to avoid turning an <input/> into a <select/>.
            var fieldType = modelExplorer.ModelType;
            if (typeof(bool?) != fieldType)
            {
                fieldType = modelExplorer.Metadata.UnderlyingOrModelType;
            }

            foreach (var typeName in TemplateRenderer.GetTypeNames(modelExplorer.Metadata, fieldType))
            {
                yield return typeName;
            }
        }
    }
}
