namespace backend.Models
{
    public class PlanItem
    {
        public int PlanItemID{get;set;}
        public int PlanID{get;set;}
        public int PlaceID{get;set;}
        public string Note{get;set;}="";
    }
}