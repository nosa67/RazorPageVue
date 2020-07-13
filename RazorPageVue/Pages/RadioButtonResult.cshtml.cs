using Microsoft.AspNetCore.Mvc.RazorPages;

namespace RazorPageVue.Pages
{
    public class RadioButtonResultModel : PageModel
    {
        public string SelectedId { get; set; }

        public string SelectedName { get; set; }

        public string RequiredSelectedId { get; set; } 

        public string RequiredSelectedName { get; set; }

        public SampleEnum? SelectedEnum { get; set; }
        public string SelectedEnumText
        {
            get
            {
                return (SelectedEnum == null) ? "" : SelectedEnum.ToString();
            }
        }

        public SampleEnum RequiredSelectedEnum { get; set; }

        public void OnGet(string selectedId,  string selectedName, string requiredSelectedId, string requiredSelectedName, SampleEnum? selectedEnum, SampleEnum requiredSelectedEnum)
        {
            SelectedId = (selectedId==null)?"": selectedId;
            SelectedName = selectedName;
            RequiredSelectedId = (requiredSelectedId == null) ? "" : requiredSelectedId; ;
            RequiredSelectedName = requiredSelectedName;
            SelectedEnum = selectedEnum;
            RequiredSelectedEnum = requiredSelectedEnum;
        }
    }
}
