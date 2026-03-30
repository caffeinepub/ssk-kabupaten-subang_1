import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type Article = {
    id : Nat;
    title : Text;
    excerpt : Text;
    content : Text;
    category : Text;
    date : Time.Time;
    imageUrl : Text;
  };

  type TeamMember = {
    id : Nat;
    name : Text;
    role : Text;
    bio : Text;
    imageUrl : Text;
  };

  type Activity = {
    id : Nat;
    title : Text;
    description : Text;
    date : Time.Time;
    location : Text;
  };

  type ContactInfo = {
    address : Text;
    phone : Text;
    email : Text;
    operationalHours : Text;
  };

  type OldActor = {
    articles : Map.Map<Nat, Article>;
    nextArticleId : Nat;
    teamMembers : List.List<TeamMember>;
    activities : List.List<Activity>;
  };

  type NewActor = {
    articles : Map.Map<Nat, Article>;
    nextArticleId : Nat;
    teamMembers : Map.Map<Nat, TeamMember>;
    nextTeamMemberId : Nat;
    activities : Map.Map<Nat, Activity>;
    nextActivityId : Nat;
    var contactInfo : ContactInfo;
  };

  public func run(old : OldActor) : NewActor {
    let newTeamMembers = Map.fromIter<Nat, TeamMember>(old.teamMembers.toArray().map(func(tm) { (tm.id, tm) }).values());
    let newActivities = Map.fromIter<Nat, Activity>(old.activities.toArray().map(func(a) { (a.id, a) }).values());

    {
      articles = old.articles;
      nextArticleId = old.nextArticleId;
      teamMembers = newTeamMembers;
      nextTeamMemberId = 3;
      activities = newActivities;
      nextActivityId = 3;
      var contactInfo = {
        address = "Jl. Brigjen Katamso No. 1, Subang, Jawa Barat 41211";
        phone = "(0260) 411-1234";
        email = "info@ssk-subang.go.id";
        operationalHours = "Senin – Jumat, 08.00 – 16.00 WIB";
      };
    };
  };
};
