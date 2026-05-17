namespace backend.Models
{
    public class Place
    {
        public int PlaceID{get;set;}
        public string PlaceName{get;set;}="";
        public string City{get;set;}="";
        public string Country{get;set;}="";
        public string Category{get;set;}="";
        public string Description{get;set;}="";
        public double EstimatedCost{get;set;}
        public string Currency {get;set;}="";
        public double Rating {get;set;}
        public string ImagePath{get;set;}="";
    }
}