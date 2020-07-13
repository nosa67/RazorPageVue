using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;

namespace RazorPageVue.VueTagHelpers
{
    /// <summary>
    /// 「vue-integer-input」タグのタグヘルパー
    /// 　asp-forの対象が実数型であることが条件となる
    /// </summary>
    [HtmlTargetElement("vue-real-input", Attributes = ForAttributeName, TagStructure = TagStructure.NormalOrSelfClosing)]
    public class VueRealInputTagHelper : VueInputTagHelper
    {
        /// <summary>
        /// 許容データ型リスト
        /// </summary>
        private static readonly List<string> canInputTypes = new List<string>
           { nameof(Single),nameof(Double),nameof(Decimal) };

        /// <summary>
        /// コンストラクタ
        /// </summary>
        /// <param name="generator">The <see cref="IHtmlGenerator"/>.</param>
        public VueRealInputTagHelper(IHtmlGenerator generator) : base(generator)
        {
            _overrideType = "number";
        }

        /// <summary>
        /// タグヘルパーの実行実装
        /// </summary>
        /// <param name="context"></param>
        /// <param name="output"></param>
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            // 関連付けされているデータ型のチェック
            if (!CheckValueType()) throw new VueServerException("<vue-real-input>タグに関連付けられているプロパティーが実数ではありません。");

            base.Process(context, output);
        }

        /// <summary>
        /// 関連付けされているデータ型のチェック
        /// </summary>
        /// <returns></returns>
        private bool CheckValueType()
        {
            foreach (var valueTypeHInt in GetInputValueTypeHints())
            {
                var findIndex = canInputTypes.IndexOf(valueTypeHInt);
                if (findIndex >= 0) return true;
            }

            return false;
        }
    }
}
