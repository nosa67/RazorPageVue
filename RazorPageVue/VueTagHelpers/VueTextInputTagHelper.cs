using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace RazorPageVue.VueTagHelpers
{
    [HtmlTargetElement("vue-text-input", Attributes = ForAttributeName, TagStructure = TagStructure.NormalOrSelfClosing)]
    public class VueTextInputTagHelper : VueInputTagHelper
    {
        /// <summary>
        /// コンストラクタ
        /// </summary>
        /// <param name="generator">The <see cref="IHtmlGenerator"/>.</param>
        public VueTextInputTagHelper(IHtmlGenerator generator) : base(generator)
        {
        }
    }
}
