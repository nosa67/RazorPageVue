using System;

namespace RazorPageVue.VueValidations
{
    public class VueValidationError : Exception
    {
        public VueValidationError() : base() { }

        public VueValidationError(string errorMessage) : base(errorMessage) { }
    }
}
