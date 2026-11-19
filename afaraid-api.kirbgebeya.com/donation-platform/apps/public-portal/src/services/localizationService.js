import { LOCALE_CONFIG } from "../config";

// Translation files
const translations = {
  en: {
    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      confirm: "Confirm",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      close: "Close",
      back: "Back",
      next: "Next",
      previous: "Previous",
      submit: "Submit",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      view: "View",
      download: "Download",
      share: "Share",
      copy: "Copy",
      print: "Print",
    },

    // Navigation
    nav: {
      home: "Home",
      campaigns: "Campaigns",
      about: "About",
      contact: "Contact",
      donate: "Donate",
      myDonations: "My Donations",
      enterDonorId: "Enter Your Donor ID",
      donorIdHelp: "This is usually on your receipt or confirmation email.",
      emptyDonorId: "Please enter a Donor ID",
      invalidFormat: "Invalid format. Use: DON-AB12CD",
      donorNotFound:
        "Donor Identity Number not found. Please check and try again.",
    },

    // Homepage
    home: {
      heroTitle: "Supporting Afar Families Through Sustainable Livestock",
      heroSubtitle:
        "Join our mission to provide three goats per household to 2,131 families affected by the recent natural disaster in the Afar region, improving both immediate nutrition and long-term livelihood opportunities.",
      donateNow: "Donate Now",
      viewCampaigns: "View Campaigns",
      familiesHelped: "Families Helped",
      raised: "Raised",
      goatsDistributed: "Goats Distributed",
      featuredCampaigns: "Featured Campaigns",
      howItWorks: "How It Works",
      ourImpact: "Our Impact",
      testimonials: "What People Say",
      afarRelief: "Afar Region Disaster Relief",
      targetFamilies: "2,131 Families",
      totalGoats: "6,393 Goats Needed",
    },

    // Campaigns
    campaigns: {
      title: "Active Campaigns",
      subtitle:
        "Browse our current campaigns and find the cause that speaks to your heart.",
      searchPlaceholder: "Search campaigns...",
      allStatus: "All Status",
      active: "Active",
      completed: "Completed",
      progress: "Progress",
      donors: "Donors",
      viewDetails: "View Details",
      donateNow: "Donate Now",
      noCampaignsFound: "No campaigns found matching your criteria.",
      clearFilters: "Clear filters",
    },

    // Donation
    donation: {
      title: "Make a Donation",
      subtitle:
        "Your contribution helps provide sustainable livestock to families in need",
      chooseType: "Choose Your Donation Type",
      donateGoats: "Donate Goats",
      donateAmount: "Donate Amount",
      selectGoats: "Select specific goats to donate to families",
      chooseAmount: "Choose a specific dollar amount",
      startingAt: "Starting at",
      perGoat: "per goat",
      anyAmount: "Any amount helps",
      selectGoatsToDonate: "Select Goats to Donate",
      totalGoatsSelected: "Total Goats Selected",
      totalAmount: "Total Amount",
      goats: "goats",
      dedicationMessage: "Dedication Message (Optional)",
      dedicationPlaceholder:
        "Add a personal message for the family receiving your donation...",
      anonymousDonation: "Make this donation anonymous",
      newsletter: "Subscribe to our newsletter for campaign updates",
      yourInformation: "Your Information",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phone: "Phone Number",
      address: "Address",
      city: "City",
      state: "State",
      zipCode: "ZIP Code",
      paymentInformation: "Payment Information",
      cardNumber: "Card Number",
      expiryDate: "Expiry Date",
      cvv: "CVV",
      nameOnCard: "Name on Card",
      securePayment: "Secure Payment",
      securePaymentText:
        "Your payment information is encrypted and secure. We never store your card details.",
      processing: "Processing...",
      completeDonation: "Complete Donation",
      thankYou: "Thank You!",
      donationSuccess:
        "Your donation has been processed successfully. You will receive a confirmation email shortly.",
      goatDonationSummary: "Your Goat Donation Summary",
      viewMyDonations: "View My Donations",
      browseMoreCampaigns: "Browse More Campaigns",
      secureTransaction: "Secure Transaction",
      impactMessage: "Impact Message",
    },

    dashboard: {
      title: "My Donor Dashboard",
      subtitle: "Track your donations and see the impact you're making",
      totalDonated: "Total Donated",
      totalDonations: "Total Donations",
      campaigns: "Campaigns",
      lastDonation: "Last Donation",
      overview: "Overview",
      myDonations: "My Donations",
      myImpact: "My Impact",
      recentDonations: "Recent Donations",
      yourImpact: "Your Impact",
      familiesHelped: "Families Helped",
      goatsProvided: "Goats Provided",
      communities: "Communities",
      impactStory: "Your Impact Story",
      impactDescription:
        "Through your generous donations, you've made a real difference in the lives of families affected by natural disasters and economic hardship.",
      familiesDirectlyHelped: "Families Directly Helped",
      familiesDesc:
        "Your donations have provided sustainable livestock to {{count}} families.",
      goatsDesc:
        "{{count}} healthy goats have been distributed to families in need.",
      communitiesReached: "Communities Reached",
      communitiesDesc:
        "Your impact extends across {{count}} different communities.",
      thankYou: "Thank You for Making a Difference!",
      rippleEffect:
        "Your generosity has created a ripple effect of hope and sustainability.",
      makeAnotherDonation: "Make Another Donation",
      shareImpact: "Share Your Impact",
      error: "Failed to load dashboard",
    },

    // Goat Types
    goatTypes: {
      young: "Young Goat",
      adult: "Adult Goat",
      youngAge: "6-12 months",
      adultAge: "1-3 years",
      youngDesc: "Perfect for starting a family's livestock journey",
      adultDesc: "Ready for breeding and milk production",
    },

    // Currency
    currency: {
      usd: "US Dollar",
      etb: "Ethiopian Birr",
      selectCurrency: "Select Currency",
    },
  },

  am: {
    // Amharic translations
    common: {
      loading: "በመጫን ላይ...",
      error: "ስህተት",
      success: "ተሳክቷል",
      cancel: "ሰርዝ",
      confirm: "አረጋግጥ",
      save: "አስቀምጥ",
      edit: "አርትዖት",
      delete: "ሰርዝ",
      close: "ዝጋ",
      back: "ተመለስ",
      next: "ቀጣይ",
      previous: "ቀዳሚ",
      submit: "ላክ",
      search: "ፈልግ",
      filter: "አጣራ",
      sort: "ደርድር",
      view: "አይተው",
      download: "አውርድ",
      share: "አጋራ",
      copy: "ቅዳ",
      print: "አትም",
    },

    nav: {
      home: "መነሻ",
      campaigns: "ዘመቻዎች",
      about: "ስለኛ",
      contact: "አግኙን",
      donate: "ለመስጠት",
      myDonations: "የኔ ልገሶች",
      enterDonorId: "የእርስዎን ልገሳ መለያ ቁጥር ያስገቡ",
      donorIdHelp: "ይህ ብዙውን ጊዜ በደረሰኝዎ ወይም በማረጋገጫ ኢሜይልዎ ላይ ይገኛል።",
      emptyDonorId: "እባክዎ የልገሳ መለያ ቁጥር ያስገቡ",
      invalidFormat: "የተሳሳተ ቅርጸት። ይጠቀሙ: DON-AB12CD",
      donorNotFound: "የልገሳ መለያ ቁጥር አልተገኘም። እባክዎ ያረጋግጡ እና እንደገና ይሞክሩ።",
    },

    home: {
      heroTitle: "በተመጣጣኝ እንስሳት በአፋር ቤተሰቦች በመደገፍ",
      heroSubtitle:
        "በአፋር ክልል በቅርቡ በተፈጠረው የተፈጥሮ አደጋ በተጠቃቂ 2,131 ቤተሰቦች ላይ በአንድ ቤተሰብ ሦስት ፍየሎች በመስጠት በመልካም አላማ ይቀላቀሉ።",
      donateNow: "አሁን ለመስጠት",
      viewCampaigns: "ዘመቻዎችን አይተው",
      familiesHelped: "የተረዱ ቤተሰቦች",
      raised: "ተሰብስቧል",
      goatsDistributed: "የተሰራጩ ፍየሎች",
      featuredCampaigns: "የተመረጡ ዘመቻዎች",
      howItWorks: "እንዴት ነው የሚሰራው",
      ourImpact: "የኛ ተጽእኖ",
      testimonials: "ሰዎች ምን ይላሉ",
      afarRelief: "የአፋር ክልል አደጋ እርዳታ",
      targetFamilies: "2,131 ቤተሰቦች",
      totalGoats: "6,393 ፍየሎች ያስፈልጋሉ",
    },

    campaigns: {
      title: "ንቁ ዘመቻዎች",
      subtitle: "የኛን ወቅታዊ ዘመቻዎች ያስተናግዱ እና በልብዎ ውስጥ የሚናገረውን ምክንያት ያግኙ።",
      searchPlaceholder: "ዘመቻዎችን ፈልግ...",
      allStatus: "ሁሉም ሁኔታ",
      active: "ንቁ",
      completed: "ተጠናቋል",
      progress: "እድገት",
      donors: "ለገሶች",
      viewDetails: "ዝርዝሮችን አይተው",
      donateNow: "አሁን ለመስጠት",
      noCampaignsFound: "ከመስፈርትዎ ጋር የሚዛመዱ ዘመቻዎች አልተገኙም።",
      clearFilters: "አጣሪዎችን አጽዳ",
    },

    donation: {
      title: "ልገስ አድርግ",
      subtitle: "የእርስዎ አስተዋፅኦ በገደብ ያሉ ቤተሰቦች ተመጣጣኝ እንስሳት እንዲያገኙ ይረዳል",
      chooseType: "የልገስ አይነት ይምረጡ",
      donateGoats: "ፍየሎችን ለመስጠት",
      donateAmount: "መጠን ለመስጠት",
      selectGoats: "ቤተሰቦች የሚሰጡትን የተወሰኑ ፍየሎች ይምረጡ",
      chooseAmount: "የተወሰነ የዶላር መጠን ይምረጡ",
      startingAt: "ከ",
      perGoat: "በአንድ ፍየል",
      anyAmount: "ማንኛውም መጠን ይረዳል",
      selectGoatsToDonate: "ለመስጠት የሚሰጡትን ፍየሎች ይምረጡ",
      totalGoatsSelected: "የተመረጡ ጠቅላላ ፍየሎች",
      totalAmount: "ጠቅላላ መጠን",
      goats: "ፍየሎች",
      dedicationMessage: "የማዋረድ መልእክት (አማራጭ)",
      dedicationPlaceholder: "ልገስዎን የሚቀበለውን ቤተሰብ የሚያመለክት የግል መልእክት ያክሉ...",
      anonymousDonation: "ይህን ልገስ ስም የማይታወቅ አድርግ",
      newsletter: "ለዘመቻ ዝመናዎች የኛን ዜና መጽሔት ይመዝገቡ",
      yourInformation: "የእርስዎ መረጃ",
      firstName: "የመጀመሪያ ስም",
      lastName: "የመጨረሻ ስም",
      email: "የኢሜይል አድራሻ",
      phone: "የስልክ ቁጥር",
      address: "አድራሻ",
      city: "ከተማ",
      state: "ክልል",
      zipCode: "የፖስታ ኮድ",
      paymentInformation: "የክፍያ መረጃ",
      cardNumber: "የካርድ ቁጥር",
      expiryDate: "የመጨረሻ ቀን",
      cvv: "CVV",
      nameOnCard: "በካርድ ላይ ያለው ስም",
      securePayment: "ደህንነቱ የተጠበቀ ክፍያ",
      securePaymentText:
        "የክፍያዎ መረጃ ተመስጦር እና ደህንነቱ የተጠበቀ ነው። የካርድዎን ዝርዝሮች አንሰብስብም።",
      processing: "በማስተናገድ ላይ...",
      completeDonation: "ልገስ አጠናቅቅ",
      thankYou: "አመሰግናለሁ!",
      donationSuccess: "የእርስዎ ልገስ በተሳካ ሁኔታ ተከናውኗል። በቅርቡ የማረጋገጫ ኢሜይል ይቀበላሉ።",
      goatDonationSummary: "የፍየል ልገስ ማጠቃለያ",
      viewMyDonations: "የኔን ልገሶች አይተው",
      browseMoreCampaigns: "ተጨማሪ ዘመቻዎችን ያስተናግዱ",
      secureTransaction: "ደህንነቱ የተጠበቀ ግብይት",
      impactMessage: "የተፅእኖ መልእክት",

    },

    dashboard: {
      title: "የእኔ ልገሳ ዳሽቦርድ",
      subtitle: "ልገሶችዎን ይከታተሉ እና የሚያደርጉትን ተፅእኖ ይመልከቱ",
      totalDonated: "ጠቅላላ ልገሳ",
      totalDonations: "ጠቅላላ ልገሶች",
      campaigns: "ዘመቻዎች",
      lastDonation: "የመጨረሻ ልገሳ",
      overview: "አጠቃላይ እይታ",
      myDonations: "የኔ ልገሶች",
      myImpact: "የኔ ተፅእኖ",
      recentDonations: "የቅርብ ጊዜ ልገሶች",
      yourImpact: "የእርስዎ ተፅእኖ",
      familiesHelped: "የተረዱ ቤተሰቦች",
      goatsProvided: "የተሰጡ ፍየሎች",
      communities: "ማህበረሰቦች",
      impactStory: "የእርስዎ ተፅእኖ ታሪክ",
      impactDescription:
        "በተትረፈረፈ ልገሳዎ በተፈጥሮ አደጋዎችና በኢኮኖሚ ችግር በተጠቃቂ ቤተሰቦች ሕይወት ላይ ትልቅ ለውጥ አድርገዋል።",
      familiesDirectlyHelped: "በቀጥታ የተረዱ ቤተሰቦች",
      familiesDesc: "ልገሶችዎ {{count}} ቤተሰቦችን በተመጣጣኝ እንስሳት አቅርበዋል።",
      goatsDesc: "{{count}} ጤናማ ፍየሎች ለተፈላጊ ቤተሰቦች ተሰራጭተዋል።",
      communitiesReached: "የተደረሱ ማህበረሰቦች",
      communitiesDesc: "ተፅእኖዎ በ{{count}} የተለያዩ ማህበረሰቦች ላይ ይዘልቃል።",
      thankYou: "ለመለወጥ እናመሰግናለን!",
      rippleEffect: "የእርስዎ ልገሳ የተስፋ እና ዘላቂነት ሞገድ ፈጥሯል።",
      makeAnotherDonation: "ሌላ ልገሳ ያድርጉ",
      shareImpact: "ተፅእኖዎን ያጋሩ",
      error: "ዳሽቦርዱን መጫን አልተሳካም",
    },

    goatTypes: {
      young: "የወጣት ፍየል",
      adult: "የአዋቂ ፍየል",
      youngAge: "6-12 ወር",
      adultAge: "1-3 ዓመት",
      youngDesc: "የቤተሰብ እንስሳት ጉዞ ለመጀመር ተስማሚ",
      adultDesc: "ለማባዛት እና ወተት ምርት ዝግጁ",
    },

    currency: {
      usd: "የአሜሪካ ዶላር",
      etb: "የኢትዮጵያ ብር",
      selectCurrency: "ምንዛሪ ይምረጡ",
    },
  },

  or: {
    // Oromo translations (simplified)
    common: {
      loading: "Hojjechaa jira...",
      error: "Dogoggora",
      success: "Milkaa'e",
      cancel: "Dhiisi",
      confirm: "Mirkaneessi",
      save: "Qabsiisi",
      edit: "Fooyyeessi",
      delete: "Haqu",
      close: "Cufi",
      back: "Duubatti deebi",
      next: "Dhugaatii",
      previous: "Duraan",
      submit: "Ergi",
      search: "Barbaadi",
      filter: "Seenuu",
      sort: "Qoqqoodi",
      view: "Ilaali",
      download: "Buufi",
      share: "Qoodi",
      copy: "Koopii",
      print: "Maxxansi",
    },

    nav: {
      home: "Mana",
      campaigns: "Campaigns",
      about: "Waa'ee keenya",
      contact: "Nu qunnamaa",
      donate: "Kennaa",
      myDonations: "Kennaa koo",
      enterDonorId: "Lakkoofsa Kennaa Keessan Galchaa",
      donorIdHelp:
        "Kun guutummaa guutuutti ressiitii ykn email mirkaneessaa keessatti argama.",
      emptyDonorId: "Mee Lakkoofsa Kennaa Galchaa",
      invalidFormat: "Qindaa dogoggora. Fayyadami: DON-AB12CD",
      donorNotFound:
        "Lakkoofsa Kennaa hin argamne. Mee mirkaneessiifi irra deebi.",
    },

    home: {
      heroTitle:
        "Maatiilee Afar Foon Hayyootaa Duraan Duraan Ta'eetti Gargaarsa",
      heroSubtitle:
        "Kaayyoo keenyaa keessatti makamtaa. Maatiilee 2,131 miidhamanii jiran keessatti maatiilee tokko tokko keessatti sadii re'ee kennaa jennu.",
      donateNow: "Amma Kennaa",
      viewCampaigns: "Campaigns ilaali",
      familiesHelped: "Maatiilee Gargaarfaman",
      raised: "Qabame",
      goatsDistributed: "Re'ee Dhiyaate",
      featuredCampaigns: "Campaigns Filataman",
      howItWorks: "Akka Hojjettu",
      ourImpact: "Dhiibbaa Keenya",
      testimonials: "Namoonni Maal Jettu",
      afarRelief: "Afar Naannoo Balaa Gargaarsa",
      targetFamilies: "Maatiilee 2,131",
      totalGoats: "Re'ee 6,393 Barbaachisa",
    },

    campaigns: {
      title: "Campaigns Hojjechaa Jiran",
      subtitle:
        "Campaigns amma jiran keessaa barbaadi. Sababa onnee kee dubbatu argadhu.",
      searchPlaceholder: "Campaigns barbaadi...",
      allStatus: "Haala Hundaa",
      active: "Hojjechaa Jira",
      completed: "Milkaa'e",
      progress: "Fufiinsa",
      donors: "Kennaa Kennaa",
      viewDetails: "Ibsa Guddaa Ilaali",
      donateNow: "Amma Kennaa",
      noCampaignsFound: "Campaigns barbaachisan hin argamne.",
      clearFilters: "Seenuu cufi",
    },

    donation: {
      title: "Kennaa Taasisaa",
      subtitle:
        "Kennaa kee maatiilee miidhamanii jiran foon hayyootaa duraan duraan ta'e argachisuuf gargaara.",
      chooseType: "Gosa Kennaa Filadhu",
      donateGoats: "Re'ee Kennaa",
      donateAmount: "Baay'ee Kennaa",
      selectGoats: "Re'ee adda addaa maatiilee kennaa jennu filadhu",
      chooseAmount: "Baay'ee dollar adda addaa filadhu",
      startingAt: "Eegaluu",
      perGoat: "Re'ee tokko tokko",
      anyAmount: "Baay'ee kamiiyyuu gargaara",
      selectGoatsToDonate: "Re'ee Kennaa Filadhu",
      totalGoatsSelected: "Re'ee Hundaa Filataman",
      totalAmount: "Baay'ee Hundaa",
      goats: "Re'ee",
      dedicationMessage: "Ergaa Kennaa (Filannoo)",
      dedicationPlaceholder:
        "Ergaa kee argachuuf jiru maatiilee ergaa kee dubbisi...",
      anonymousDonation: "Kennaa kun maqaan hin beekkamu haa ta'u",
      newsletter: "Oduu campaign keessaa nuu qabsiisi",
      yourInformation: "Odeeffannoo Keetii",
      firstName: "Maqaa Jalqabaa",
      lastName: "Maqaa Dhumaa",
      email: "Email",
      phone: "Lakkoofsi Bilbilaa",
      address: "Teessoo",
      city: "Magaalaa",
      state: "Naannoo",
      zipCode: "Zip Code",
      paymentInformation: "Odeeffannoo Kaffaltii",
      cardNumber: "Lakkoofsi Kaardii",
      expiryDate: "Guyyaa Dhumaa",
      cvv: "CVV",
      nameOnCard: "Maqaan Kaardii Irratti",
      securePayment: "Kaffaltii Nageenya Qaba",
      securePaymentText:
        "Odeeffannoo kaffaltii kee niiccisiifamee nageenya qaba. Lakkoofsi kaardii kee hin qabnu.",
      processing: "Hojjechaa jira...",
      completeDonation: "Kennaa Xumuri",
      thankYou: "Galata!",
      donationSuccess:
        "Kennaa kee milkaa'e. Email mirkaneessaa dhiyaate argachuuf jirti.",
      goatDonationSummary: "Gabaabaa Kennaa Re'ee",
      viewMyDonations: "Kennaa Koo Ilaali",
      browseMoreCampaigns: "Campaigns Dabalataa Barbaadi",
    },

    dashboard: {
      title: "Dashboard Kennaa Koo",
      subtitle: "Kennaa kee ilaaliifi dhiibbaa kee argi",
      totalDonated: "Kennaa Guutummaa",
      totalDonations: "Kennaa Hundaa",
      campaigns: "Kampaanii",
      lastDonation: "Kennaa Dhumaa",
      overview: "Ilaalcha Guutummaa",
      myDonations: "Kennaa Koo",
      myImpact: "Dhiibbaa Koo",
      recentDonations: "Kennaa Dhihoo",
      yourImpact: "Dhiibbaa Keeti",
      familiesHelped: "Maatiilee Gargaaramani",
      goatsProvided: "Re’ee Kennaman",
      communities: "Gareelee",
      impactStory: "Seenaa Dhiibbaa Keeti",
      impactDescription:
        "Kennaa kee baay’ee maatiilee miidhamanii jiran keessatti jireenya isaanii fooyyeessuuf gargaaru.",
      familiesDirectlyHelped: "Maatiilee Garaa Garaa Gargaaramani",
      familiesDesc:
        "Kennaa kee {{count}} maatiilee foon hayyootaa kennuu gargaare.",
      goatsDesc:
        "{{count}} re’ee fayyaa qabu maatiilee barbaachisaniif raabsame.",
      communitiesReached: "Gareelee Argamani",
      communitiesDesc:
        "Dhiibbaan kee {{count}} garee adda addaa keessatti babal’ate.",
      thankYou: "Galata! Dhiibbaa Uumtu!",
      rippleEffect: "Kennaa kee gammachuu fi jireenya dhaabbataa uume.",
      makeAnotherDonation: "Kennaa Biraa Taasi",
      shareImpact: "Dhiibbaa Kee Qooddi",
      error: "Dashboard banuu hin dandeenye",
    },

    goatTypes: {
      young: "Re'ee Dargaggeessa",
      adult: "Re'ee Guddadhaa",
      youngAge: "Ji'a 6-12",
      adultAge: "Waggaa 1-3",
      youngDesc: "Maatiilee foon hayyootaa jalqabaaaf gaarii",
      adultDesc: "Baay'isuu fi aannan uumuuf qophaa'e",
    },

    currency: {
      usd: "Dollar Ameerikaa",
      etb: "Birr Itoophiyaa",
      selectCurrency: "Mallattoo Qarshii Filadhu",
    },
  },
};

export const localizationService = {
  getCurrentLanguage: () => {
    return localStorage.getItem("language") || LOCALE_CONFIG.DEFAULT;
  },

  setLanguage: (language) => {
    if (LOCALE_CONFIG.SUPPORTED.includes(language)) {
      localStorage.setItem("language", language);
      return true;
    }
    return false;
  },

  t: (key, params = {}) => {
    const language = localizationService.getCurrentLanguage();
    const translation =
      translations[language] || translations[LOCALE_CONFIG.DEFAULT];

    const keys = key.split(".");
    let value = translation;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        const defaultTranslation = translations[LOCALE_CONFIG.DEFAULT];
        let fallbackValue = defaultTranslation;
        for (const fallbackKey of keys) {
          fallbackValue = fallbackValue?.[fallbackKey];
        }
        return fallbackValue || key;
      }
    }

    if (typeof value === "string" && Object.keys(params).length > 0) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] || match;
      });
    }

    return value || key;
  },

  getSupportedLanguages: () => {
    return LOCALE_CONFIG.SUPPORTED.map((code) => ({
      code,
      name: localizationService.getLanguageName(code),
      nativeName: localizationService.getLanguageNativeName(code),
    }));
  },

  getLanguageName: (code) => {
    const names = {
      en: "English",
      am: "Amharic",
      or: "Oromo",
    };
    return names[code] || code;
  },

  getLanguageNativeName: (code) => {
    const nativeNames = {
      en: "English",
      am: "አማርኛ",
      or: "Afaan Oromoo",
    };
    return nativeNames[code] || code;
  },

  formatDate: (date, options = {}) => {
    const language = localizationService.getCurrentLanguage();
    const defaultOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return new Intl.DateTimeFormat(language, {
      ...defaultOptions,
      ...options,
    }).format(new Date(date));
  },

  formatNumber: (number, options = {}) => {
    const language = localizationService.getCurrentLanguage();
    return new Intl.NumberFormat(language, options).format(number);
  },

  formatCurrency: (amount, currency = "USD", options = {}) => {
    const language = localizationService.getCurrentLanguage();
    const defaultOptions = {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    };

    return new Intl.NumberFormat(language, {
      ...defaultOptions,
      ...options,
    }).format(amount);
  },

  getTextDirection: (language = null) => {
    const lang = language || localizationService.getCurrentLanguage();
    const rtlLanguages = ["ar", "he", "fa", "ur"];
    return rtlLanguages.includes(lang) ? "rtl" : "ltr";
  },

  initialize: () => {
    const language = localizationService.getCurrentLanguage();
    document.documentElement.lang = language;
    document.documentElement.dir =
      localizationService.getTextDirection(language);
  },
};

export default localizationService;
