using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System;

namespace RazorPageVue.VueTagHelpers
{
    [HtmlTargetElement("vue-time-input", Attributes = ForAttributeName, TagStructure = TagStructure.NormalOrSelfClosing)]
    public class VueTimeInputTagHelper : VueInputTagHelper
    {
        /// <summary>
        /// コンストラクタ
        /// </summary>
        /// <param name="generator">The <see cref="IHtmlGenerator"/>.</param>
        public VueTimeInputTagHelper(IHtmlGenerator generator) : base(generator)
        {
            _overrideType = "time";
        }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            // 関連付けされているデータ型のチェック
            if (!CheckValueType()) throw new VueServerException("<vue-integer-input>タグに関連付けられているプロパティーがTimeSpanではありません（このコンポーネントはTimeSpanのみ対応しています）。");

            base.Process(context, output);
        }

        static string TimespanTypeName = nameof(TimeSpan);


        /// <summary>
        /// 関連付けされているデータ型のチェック
        /// </summary>
        /// <returns></returns>
        private bool CheckValueType()
        {
            var valueTypeHints = GetInputValueTypeHints();
            foreach (var valueTypeHInt in valueTypeHints)
            {
                if(valueTypeHInt == TimespanTypeName)
                {
                    // TimeSpanの場合はそのまま正常とする
                    return true;
                }
            }

            // TimeSpanでなければエラー
            return false;
        }
    }
}
