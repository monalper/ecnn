import React, { useState } from "react";
import CountryFlag from "react-country-flag";
import OpenWallLogo from "../assets/OpenWall.svg";
import "./DisclaimerPage.mobile.css";

const flagList = [
  { code: "tr", icon: <CountryFlag countryCode="TR" svg title="Türkçe" style={{ width: 32, height: 24 }} />, alt: "Türkçe" },
  { code: "en", icon: <CountryFlag countryCode="GB" svg title="English" style={{ width: 32, height: 24 }} />, alt: "English" },
  { code: "de", icon: <CountryFlag countryCode="DE" svg title="Deutsch" style={{ width: 32, height: 24 }} />, alt: "Deutsch" },
];

const disclaimerTexts = {
  tr: {
    title: "Yasal Uyarı ve Sorumluluk Reddi",
    sections: [
      {
        title: "1. Bilgilendirme Amacı",
        content:
          "Bu web sitesinde sunulan tüm içerikler yalnızca genel bilgi verme amaçlıdır. Burada yer alan yazılar, görüşler, analizler, yorumlar ve diğer bilgiler; herhangi bir uzman görüşünün, profesyonel danışmanlığın veya teknik hizmetin yerine geçmez. Ziyaretçiler, sitedeki içeriklere dayanarak aldıkları kararlardan doğabilecek sonuçların sorumluluğunu tamamen kendileri taşır.",
      },
      {
        title: "2. Sorumluluk Reddi",
        content:
          "Web sitesinde yer alan bilgi ve içeriklerin doğruluğu, güncelliği ve eksiksizliği konusunda azami çaba gösterilse de, zaman içinde içeriklerin güncelliğini yitirmesi, hatalı ya da eksik bilgi içermesi mümkündür. Bu nedenle, önemli kararlar almadan önce farklı ve güvenilir kaynaklardan ek teyit yapılması önerilir.\n\nSitede yer alan bilgilerden yararlanarak oluşabilecek herhangi bir doğrudan ya da dolaylı zarar, kayıp, veri kaybı veya başka herhangi bir olumsuz durumdan dolayı site sahibi hiçbir şekilde hukuki ya da mali sorumluluk kabul etmez.",
      },
      {
        title: "3. Üçüncü Taraf Bağlantıları",
        content:
          "Bu web sitesi, ziyaretçilerine kolaylık sağlamak amacıyla üçüncü taraf web sitelerine yönlendiren bağlantılar içerebilir. Bu bağlantılar yalnızca bilgi amaçlı verilmiştir. Bu dış sitelerin içeriklerinden, güvenliğinden veya gizlilik politikalarından site sahibi sorumlu tutulamaz.",
      },
      {
        title: "4. Kullanıcı Sorumluluğu",
        content:
          "Web sitesini kullanan tüm ziyaretçiler, burada yer alan içeriklerin kendi sorumluluklarında olduğunu, bu içeriklerden etkilenmeleri halinde site sahibinin hiçbir hukuki veya mali yükümlülük taşımayacağını peşinen kabul etmiş sayılırlar.",
      },
    ],
  },
  en: {
    title: "Legal Notice and Disclaimer",
    sections: [
      {
        title: "1. Purpose of Information",
        content:
          "All content provided on this website is for general informational purposes only. The articles, opinions, analyses, comments, and other information herein do not constitute expert advice, professional consultancy, or technical service. Visitors are solely responsible for any consequences arising from decisions made based on the content of this site.",
      },
      {
        title: "2. Disclaimer",
        content:
          "Although every effort is made to ensure the accuracy, timeliness, and completeness of the information and content on this website, it is possible that the content may become outdated, contain errors, or be incomplete over time. Therefore, it is recommended to seek additional confirmation from different and reliable sources before making important decisions.\n\nThe site owner accepts no legal or financial responsibility whatsoever for any direct or indirect damage, loss, data loss, or any other negative situation that may arise from the use of the information on the site.",
      },
      {
        title: "3. Third Party Links",
        content:
          "This website may contain links to third-party websites for the convenience of visitors. These links are provided for informational purposes only. The site owner cannot be held responsible for the content, security, or privacy policies of these external sites.",
      },
      {
        title: "4. User Responsibility",
        content:
          "All visitors using the website are deemed to have accepted in advance that the content here is under their own responsibility and that the site owner bears no legal or financial liability if they are affected by this content.",
      },
    ],
  },
  de: {
    title: "Rechtlicher Hinweis und Haftungsausschluss",
    sections: [
      {
        title: "1. Zweck der Information",
        content:
          "Alle auf dieser Website bereitgestellten Inhalte dienen ausschließlich allgemeinen Informationszwecken. Die hier enthaltenen Artikel, Meinungen, Analysen, Kommentare und sonstigen Informationen stellen keine Expertenmeinung, professionelle Beratung oder technische Dienstleistung dar. Die Besucher tragen die volle Verantwortung für alle Konsequenzen, die sich aus Entscheidungen ergeben, die sie auf Grundlage der Inhalte dieser Seite treffen.",
      },
      {
        title: "2. Haftungsausschluss",
        content:
          "Obwohl alle Anstrengungen unternommen werden, um die Richtigkeit, Aktualität und Vollständigkeit der Informationen und Inhalte auf dieser Website zu gewährleisten, ist es möglich, dass die Inhalte im Laufe der Zeit ihre Aktualität verlieren, Fehler enthalten oder unvollständig sind. Daher wird empfohlen, vor wichtigen Entscheidungen zusätzliche Bestätigungen aus verschiedenen und zuverlässigen Quellen einzuholen.\n\nDer Seiteninhaber übernimmt keinerlei rechtliche oder finanzielle Verantwortung für direkte oder indirekte Schäden, Verluste, Datenverluste oder sonstige negative Umstände, die durch die Nutzung der auf der Seite bereitgestellten Informationen entstehen können.",
      },
      {
        title: "3. Links zu Drittanbietern",
        content:
          "Diese Website kann Links zu Websites Dritter enthalten, um den Besuchern einen Mehrwert zu bieten. Diese Links werden ausschließlich zu Informationszwecken bereitgestellt. Der Seiteninhaber kann nicht für die Inhalte, die Sicherheit oder die Datenschutzrichtlinien dieser externen Seiten verantwortlich gemacht werden.",
      },
      {
        title: "4. Verantwortung des Nutzers",
        content:
          "Alle Besucher, die die Website nutzen, gelten als im Voraus damit einverstanden, dass die hier bereitgestellten Inhalte in ihrer eigenen Verantwortung liegen und dass der Seiteninhaber keinerlei rechtliche oder finanzielle Haftung übernimmt, falls sie von diesen Inhalten betroffen sind.",
      },
    ],
  },
};

const DisclaimerPage = () => {
  const [lang, setLang] = useState("tr");
  const { title, sections } = disclaimerTexts[lang];

  // Sadece bu sayfa için body arkaplanını kırmızı yap
  React.useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#d90429';
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

  return (
    <div className="disclaimer-root">
      <div className="disclaimer-main">
        <div className="disclaimer-left">
          <div className="disclaimer-title">
            {lang === "en"
              ? (<>
                  Legal Notice<br />and Disclaimer
                </>)
              : title.split(" ve ").length === 2
                ? (<>{title.split(" ve ")[0]}<br />{title.split(" ve ")[1]}</>)
                : title
            }
          </div>
          <div className="disclaimer-flags">
            {flagList.map((flag) => (
              <span
                key={flag.code}
                onClick={() => setLang(flag.code)}
                className={`disclaimer-flag${lang === flag.code ? " selected" : ""}`}
                style={{ fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}
                title={flag.alt}
              >
                {flag.icon}
              </span>
            ))}
          </div>
        </div>
        <div className="disclaimer-right">
          {sections.map((sec, i) => (
            <div key={i} className="disclaimer-section">
              <div className="disclaimer-section-title">{sec.title}</div>
              <div className="disclaimer-section-content">{sec.content}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="disclaimer-logo-wrapper">
        <img src={OpenWallLogo} alt="OpenWall Logo" className="disclaimer-logo" />
      </div>
    </div>
  );
};

export default DisclaimerPage;

