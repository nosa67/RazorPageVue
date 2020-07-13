using System;

namespace RazorPageVue
{
    public class VueServerException : Exception
    {
        public VueServerException() { }

        public VueServerException(string ErrorMessage) : base(ErrorMessage) { }
    }
}
