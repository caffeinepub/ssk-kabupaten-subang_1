import Map "mo:core/Map";
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

  type ProgramUnggulan = {
    judul : Text;
    deskripsi : Text;
    pesertaTerlatih : Text;
    programKegiatan : Text;
    penghargaan : Text;
    kecamatanTerlayani : Text;
  };

  type VideoYoutube = {
    id : Nat;
    title : Text;
    youtubeId : Text;
    description : Text;
  };

  type Profile = {
    namaOrganisasi : Text;
    tagline : Text;
    deskripsi : Text;
    visi : Text;
    misi : Text;
  };

  type GaleriItem = {
    id : Nat;
    title : Text;
    description : Text;
    mediaUrl : Text;
    mediaType : Text;
    tanggal : Time.Time;
  };

  type PendaftaranAnggota = {
    id : Nat;
    nama : Text;
    nik : Text;
    alamat : Text;
    phone : Text;
    email : Text;
    pekerjaan : Text;
    alasan : Text;
    tanggalDaftar : Time.Time;
    status : Text;
  };

  type SatuanSSK = {
    id : Nat;
    nama : Text;
    alamat : Text;
    phone : Text;
    email : Text;
    deskripsi : Text;
    logoUrl : Text;
    ketua : Text;
  };

  type SiteSettings = {
    logoUrl : Text;
  };

  type OldActor = {
    articles : Map.Map<Nat, Article>;
    teamMembers : Map.Map<Nat, TeamMember>;
    activities : Map.Map<Nat, Activity>;
    videos : Map.Map<Nat, VideoYoutube>;
    nextArticleId : Nat;
    nextTeamMemberId : Nat;
    nextActivityId : Nat;
    nextVideoId : Nat;
    contactInfo : ContactInfo;
    programUnggulan : ProgramUnggulan;
    profile : Profile;
  };

  type NewActor = {
    articles : Map.Map<Nat, Article>;
    teamMembers : Map.Map<Nat, TeamMember>;
    activities : Map.Map<Nat, Activity>;
    videos : Map.Map<Nat, VideoYoutube>;
    galeriItems : Map.Map<Nat, GaleriItem>;
    pendaftaranAnggota : Map.Map<Nat, PendaftaranAnggota>;
    satuanSSK : Map.Map<Nat, SatuanSSK>;
    nextArticleId : Nat;
    nextTeamMemberId : Nat;
    nextActivityId : Nat;
    nextVideoId : Nat;
    nextGaleriItemId : Nat;
    nextPendaftaranId : Nat;
    nextSatuanId : Nat;
    contactInfo : ContactInfo;
    programUnggulan : ProgramUnggulan;
    profile : Profile;
    siteSettings : SiteSettings;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      galeriItems = Map.empty<Nat, GaleriItem>();
      pendaftaranAnggota = Map.empty<Nat, PendaftaranAnggota>();
      satuanSSK = Map.empty<Nat, SatuanSSK>();
      nextGaleriItemId = 0;
      nextPendaftaranId = 0;
      nextSatuanId = 0;
      siteSettings = { logoUrl = "" };
    };
  };
};
