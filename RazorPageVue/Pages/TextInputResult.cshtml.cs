using Microsoft.AspNetCore.Mvc.RazorPages;

namespace RazorPageVue.Pages
{
    public class TextInputResultModel : PageModel
    {
        public string TextNocheck { get; set; } = "TextNocheck";
        public string TextRequired { get; set; } = "";
        public string TextRequiredMsgChange { get; set; } = "";
        public string TextMinLength { get; set; } = "aaa";
        public string TextMinLengthMsg { get; set; } = "aaa";
        public string TextMaxLength { get; set; } = "aaaaaaaaaab";
        public string TextMaxLengthMsg { get; set; } = "aaaaaaaaaab";
        public string TextMinMaxLength { get; set; } = "aaaaaaaaa";
        public string TextCompaire1 { get; set; } = "aaa";
        public string TextCompaire2 { get; set; } = "bbb";
        public string TextCompaireMsg1 { get; set; } = "aaa";
        public string TextCompaireMsg2 { get; set; } = "bbb";
        public string TextUrl { get; set; } = "bbb";
        public string TextUrlMsg { get; set; } = "bbb";
        public string TextEmail { get; set; } = "bbb";
        public string TextEmailMsg { get; set; } = "bbb";

        public void OnGet(TextInputModel.InputModel inputValues)
        {
            TextNocheck = inputValues.TextNocheck;
            TextRequired = inputValues.TextRequired;
            TextRequiredMsgChange = inputValues.TextRequiredMsgChange;
            TextMinLength = inputValues.TextMinLength;
            TextMinLengthMsg = inputValues.TextMinLengthMsg;
            TextMaxLength = inputValues.TextMaxLength;
            TextMaxLengthMsg = inputValues.TextMaxLengthMsg;
            TextMinMaxLength = inputValues.TextMinMaxLength;
            TextCompaire1 = inputValues.TextCompaire1;
            TextCompaire2 = inputValues.TextCompaire2;
            TextCompaireMsg1 = inputValues.TextCompaireMsg1;
            TextCompaireMsg2 = inputValues.TextCompaireMsg2;
            TextUrl = inputValues.TextURL;
            TextUrlMsg = inputValues.TextURLMsg;
            TextEmail = inputValues.TextEMail;
            TextEmailMsg = inputValues.TextEMailMsg;

        }
}
}
