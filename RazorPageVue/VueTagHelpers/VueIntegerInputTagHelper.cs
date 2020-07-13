using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;

namespace RazorPageVue.VueTagHelpers
{
    /// <summary>
    /// 「vue-integer-input」タグのタグヘルパー
    /// 　asp-forの対象が整数型であることが条件となる
    /// </summary>
    [HtmlTargetElement("vue-integer-input", Attributes = ForAttributeName, TagStructure = TagStructure.NormalOrSelfClosing)]
    public class VueIntegerInputTagHelper : VueInputTagHelper
    {
        /// <summary>
        /// 許容データ型リスト
        /// </summary>
        private static readonly List<string> canInputTypes = new List<string>
           { nameof(Byte),nameof(SByte),nameof(Int16),nameof(UInt16),nameof(Int32),nameof(UInt32), nameof(Int64), nameof(UInt64) };

        /// <summary>
        /// コンストラクタ
        /// </summary>
        /// <param name="generator">The <see cref="IHtmlGenerator"/>.</param>
        public VueIntegerInputTagHelper(IHtmlGenerator generator) : base(generator)
        {
            _overrideType = "number";   // これをしとかないと、標準のinputのタグの作成用の処理で「type="text"」が設定されてしまう
        }

        /// <summary>
        /// タグヘルパーの実行実装
        /// </summary>
        /// <param name="context"></param>
        /// <param name="output"></param>
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            // 関連付けされているデータ型のチェック
            if (!CheckValueType()) throw new VueServerException("<vue-integer-input>タグに[asp-for]で関連付けられているプロパティーが整数ではありません。");

            base.Process(context, output);
        }

        /// <summary>
        /// 関連付けされているデータ型のチェック
        /// </summary>
        /// <returns>true:対象のデータ型、false:対象外のデータ型</returns>
        private bool CheckValueType()
        { 
            // 全てのデータヒントを調べ、許容データ型があるかどうかを調べる
            foreach (var valueTypeHInt in GetInputValueTypeHints())
            {
                var findIndex = canInputTypes.IndexOf(valueTypeHInt);
                if (findIndex >= 0) return true;
            }

            return false;
        }

    }
}
