import React from "react";

const DisclaimerPage = () => (
  <div className="max-w-2xl mx-auto bg-red-600 dark:bg-red-700 p-8 rounded shadow mt-10 text-white">
    {/* Türkçe */}
    <h1 className="text-2xl font-bold mb-4">Yasal Uyarı (Disclaimer)</h1>
    <p className="mb-4">
      Bu web sitesinde yer alan tüm içerikler yalnızca genel bilgi amaçlıdır. Sitede sunulan bilgilerden dolayı oluşabilecek herhangi bir kayıp, zarar veya başka bir olumsuz durumdan site sahibi hiçbir şekilde sorumlu tutulamaz.
    </p>
    <p className="mb-4">
      Siteyi kullanan kullanıcılar, burada yer alan içeriklerin kendi sorumluluklarında olduğunu ve bu içeriklerden etkilenmeleri durumunda site sahibinin herhangi bir hukuki veya maddi sorumluluğu olmadığını kabul etmiş sayılırlar.
    </p>
    <p className="mb-8">
      İçeriklerdeki bilgiler zamanla güncelliğini yitirebilir veya eksik/yanlış olabilir. Lütfen önemli kararlarınızı almadan önce farklı kaynaklardan da doğrulama yapınız.
    </p>
    {/* English */}
    <h2 className="text-xl font-bold mb-4 mt-8">Legal Disclaimer</h2>
    <p className="mb-4">
      All content on this website is for general informational purposes only. The site owner cannot be held responsible for any loss, damage, or other negative consequences that may arise from the information provided on this site.
    </p>
    <p className="mb-4">
      By using this website, users acknowledge that they are responsible for their own actions and that the site owner has no legal or financial responsibility for any consequences resulting from the use of the content herein.
    </p>
    <p>
      The information in the content may become outdated or be incomplete/incorrect over time. Please verify important decisions with other sources before acting.
    </p>
  </div>
);

export default DisclaimerPage;
