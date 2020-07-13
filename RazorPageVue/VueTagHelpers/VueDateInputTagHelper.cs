using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System;

namespace RazorPageVue.VueTagHelpers
{
    [HtmlTargetElement("vue-date-input", Attributes = ForAttributeName, TagStructure = TagStructure.NormalOrSelfClosing)]
    public class VueDateInputTagHelper : VueInputTagHelper
    {
        /// <summary>
        /// コンストラクタ
        /// </summary>
        /// <param name="generator">The <see cref="IHtmlGenerator"/>.</param>
        public VueDateInputTagHelper(IHtmlGenerator generator) : base(generator)
        {
            _overrideType = "date";
        }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            // 関連付けされているデータ型のチェック
            if (!CheckValueType()) throw new VueServerException("<vue-integer-input>タグに関連付けられているプロパティーが日付ではありません。");

            base.Process(context, output);
        }

        static string DateTypeName = nameof(DateTime);


        /// <summary>
        /// 関連付けされているデータ型のチェック
        /// </summary>
        /// <returns></returns>
        private bool CheckValueType()
        {
            if (For.ModelExplorer.Model == null) return true;

            var valueTypeHints = GetInputValueTypeHints();
            foreach (var valueTypeHInt in valueTypeHints)
            {
                if (valueTypeHInt == DateTypeName)
                {
                    // DateTimeの場合は正常とする
                    return true;
                }
            }

            // DateTimeでなければエラー
            return false;
        }
    }
}
