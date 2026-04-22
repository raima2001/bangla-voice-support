import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const DEMO_MODE = true; // Set to false when you have API credits

// Demo responses for Horizon Telecom - comprehensive customer service
const demoResponses: { [key: string]: { [lang: string]: string } } = {
  // Plans & Packages
  'plans_list': {
    'bn': 'Horizon Telecom এর জনপ্রিয় প্ল্যান:\n\n📱 প্রিপেইড প্ল্যান:\n• Horizon Mini - ৯৯ টাকা (২ GB, ১০০ মিনিট, ৭ দিন)\n• Horizon Flex - ১৯৯ টাকা (৫ GB, আনলিমিটেড কল, ১৫ দিন)\n• Horizon Plus - ৩৯৯ টাকা (১৫ GB, আনলিমিটেড কল, ৩০ দিন)\n\n📞 পোস্টপেইড প্ল্যান:\n• Horizon Freedom - ৫৯৯ টাকা/মাস (৩০ GB, আনলিমিটেড কল)\n• Horizon Premium - ৯৯৯ টাকা/মাস (৭৫ GB, আনলিমিটেড কল, Netflix)\n\nআরো জানতে *১২১# ডায়াল করুন।',
    'en': 'Popular Horizon Telecom plans:\n\n📱 Prepaid Plans:\n• Horizon Mini - ৳99 (2 GB, 100 mins, 7 days)\n• Horizon Flex - ৳199 (5 GB, unlimited calls, 15 days)\n• Horizon Plus - ৳399 (15 GB, unlimited calls, 30 days)\n\n📞 Postpaid Plans:\n• Horizon Freedom - ৳599/month (30 GB, unlimited calls)\n• Horizon Premium - ৳999/month (75 GB, unlimited calls, Netflix)\n\nDial *121# for more info.',
    'hi': 'Horizon Telecom की लोकप्रिय योजनाएं:\n\n📱 प्रीपेड प्लान:\n• Horizon Mini - ৳99 (2 GB, 100 मिनट, 7 दिन)\n• Horizon Flex - ৳199 (5 GB, असीमित कॉल, 15 दिन)\n• Horizon Plus - ৳399 (15 GB, असीमित कॉल, 30 दिन)\n\n📞 पोस्टपेड प्लान:\n• Horizon Freedom - ৳599/माह (30 GB, असीमित कॉल)\n• Horizon Premium - ৳999/माह (75 GB, असीमित कॉल, Netflix)\n\nअधिक जानकारी के लिए *121# डायल करें।'
  },
  'prepaid_plans': {
    'bn': 'Horizon প্রিপেইড প্ল্যান:\n\n💰 বাজেট প্যাক:\n• Mini Pack - ৯৯ টাকা: ২ GB ডেটা, ১০০ মিনিট, ৭ দিন\n• Flexi Pack - ১৯৯ টাকা: ৫ GB ডেটা, আনলিমিটেড কল, ১৫ দিন\n\n⭐ জনপ্রিয় প্যাক:\n• Plus Pack - ৩৯৯ টাকা: ১৫ GB, আনলিমিটেড কল, ৩০ দিন\n• Max Pack - ৫৯৯ টাকা: ৩০ GB, আনলিমিটেড কল, ৩০ দিন\n\nরিচার্জ করতে *১২০*পিন# ডায়াল করুন।',
    'en': 'Horizon Prepaid Plans:\n\n💰 Budget Packs:\n• Mini Pack - ৳99: 2 GB data, 100 mins, 7 days\n• Flexi Pack - ৳199: 5 GB data, unlimited calls, 15 days\n\n⭐ Popular Packs:\n• Plus Pack - ৳399: 15 GB, unlimited calls, 30 days\n• Max Pack - ৳599: 30 GB, unlimited calls, 30 days\n\nRecharge via *120*PIN# or our app.',
    'hi': 'Horizon प्रीपेड प्लान:\n\n💰 बजट पैक:\n• Mini Pack - ৳99: 2 GB डेटा, 100 मिनट, 7 दिन\n• Flexi Pack - ৳199: 5 GB डेटा, असीमित कॉल, 15 दिन\n\n⭐ लोकप्रिय पैक:\n• Plus Pack - ৳399: 15 GB, असीमित कॉल, 30 दिन\n• Max Pack - ৳599: 30 GB, असीमित कॉल, 30 दिन\n\nरिचार्ज के लिए *120*PIN# डायल करें।'
  },
  'postpaid_plans': {
    'bn': 'Horizon পোস্টপেইড প্ল্যান:\n\n📞 Freedom Plan - ৫৯৯ টাকা/মাস:\n✓ ৩০ GB হাই-স্পিড ডেটা\n✓ আনলিমিটেড ভয়েস কল\n✓ ১০০ SMS ফ্রি\n\n🌟 Premium Plan - ৯৯৯ টাকা/মাস:\n✓ ৭৫ GB হাই-স্পিড ডেটা\n✓ আনলিমিটেড ভয়েস কল ও SMS\n✓ Netflix বেসিক ফ্রি\n✓ প্রায়োরিটি কাস্টমার সাপোর্ট\n\n💎 Elite Plan - ১৪৯৯ টাকা/মাস:\n✓ আনলিমিটেড ডেটা\n✓ আনলিমিটেড কল ও SMS\n✓ Netflix + Amazon Prime\n✓ ২৪/৭ ডেডিকেটেড সাপোর্ট',
    'en': 'Horizon Postpaid Plans:\n\n📞 Freedom Plan - ৳599/month:\n✓ 30 GB high-speed data\n✓ Unlimited voice calls\n✓ 100 free SMS\n\n🌟 Premium Plan - ৳999/month:\n✓ 75 GB high-speed data\n✓ Unlimited calls & SMS\n✓ Netflix Basic free\n✓ Priority customer support\n\n💎 Elite Plan - ৳1499/month:\n✓ Unlimited data\n✓ Unlimited calls & SMS\n✓ Netflix + Amazon Prime\n✓ 24/7 dedicated support',
    'hi': 'Horizon पोस्टपेड प्लान:\n\n📞 Freedom Plan - ৳599/माह:\n✓ 30 GB हाई-स्पीड डेटा\n✓ असीमित वॉयस कॉल\n✓ 100 मुफ्त SMS\n\n🌟 Premium Plan - ৳999/माह:\n✓ 75 GB हाई-स्पीड डेटा\n✓ असीमित कॉल और SMS\n✓ Netflix बेसिक मुफ्त\n✓ प्राथमिकता ग्राहक सहायता\n\n💎 Elite Plan - ৳1499/माह:\n✓ असीमित डेटा\n✓ असीमित कॉल और SMS\n✓ Netflix + Amazon Prime\n✓ 24/7 समर्पित सहायता'
  },
  'data_plans': {
    'bn': 'Horizon ডেটা প্যাক:\n\n🚀 হাই-স্পিড ডেটা:\n• ১ GB - ৪৯ টাকা (৩ দিন)\n• ৩ GB - ৯৯ টাকা (৭ দিন)\n• ৭ GB - ১৭৯ টাকা (১৫ দিন)\n• ২০ GB - ৩৯৯ টাকা (৩০ দিন)\n\n💨 আনলিমিটেড ডেটা:\n• সপ্তাহিক - ২৯৯ টাকা (১ সপ্তাহ আনলিমিটেড)\n• মাসিক - ৮৯৯ টাকা (৩০ দিন আনলিমিটেড)\n\nঅ্যাক্টিভেট করতে *১২৩# ডায়াল করুন।',
    'en': 'Horizon Data Packs:\n\n🚀 High-Speed Data:\n• 1 GB - ৳49 (3 days)\n• 3 GB - ৳99 (7 days)\n• 7 GB - ৳179 (15 days)\n• 20 GB - ৳399 (30 days)\n\n💨 Unlimited Data:\n• Weekly - ৳299 (1 week unlimited)\n• Monthly - ৳899 (30 days unlimited)\n\nActivate via *123# or our app.',
    'hi': 'Horizon डेटा पैक:\n\n🚀 हाई-स्पीड डेटा:\n• 1 GB - ৳49 (3 दिन)\n• 3 GB - ৳99 (7 दिन)\n• 7 GB - ৳179 (15 दिन)\n• 20 GB - ৳399 (30 दिन)\n\n💨 असीमित डेटा:\n• साप्ताहिक - ৳299 (1 सप्ताह असीमित)\n• मासिक - ৳899 (30 दिन असीमित)\n\nसक्रिय करने के लिए *123# डायल करें।'
  },
  // Offers & Discounts
  'offers': {
    'bn': '🎉 চলমান Horizon অফার:\n\n🔥 সীমিত সময়ের অফার:\n• নতুন গ্রাহক: প্রথম রিচার্জে ২৫% বোনাস!\n• রেফার করুন: বন্ধুকে রেফার করলে উভয়েই ১০০ টাকা বোনাস পাবেন\n• স্টুডেন্ট অফার: স্টুডেন্ট ID দেখিয়ে ২০% ছাড়\n\n💝 মাসিক অফার:\n• Horizon Plus রিচার্জে ফ্রি Netflix ১ মাস\n• পরিবার প্যাক: ৩টি কানেকশনে ৩০% ছাড়\n\nবিস্তারিত: www.horizontelecom.com/offers',
    'en': '🎉 Current Horizon Offers:\n\n🔥 Limited Time Offers:\n• New customers: 25% bonus on first recharge!\n• Refer & Earn: Both get ৳100 bonus\n• Student Offer: 20% off with student ID\n\n💝 Monthly Offers:\n• Free 1-month Netflix with Horizon Plus\n• Family Pack: 30% off on 3 connections\n\nDetails: www.horizontelecom.com/offers',
    'hi': '🎉 वर्तमान Horizon ऑफर:\n\n🔥 सीमित समय के ऑफर:\n• नए ग्राहक: पहले रिचार्ज पर 25% बोनस!\n• रेफर करें: दोनों को ৳100 बोनस\n• छात्र ऑफर: छात्र ID के साथ 20% छूट\n\n💝 मासिक ऑफर:\n• Horizon Plus के साथ मुफ्त Netflix 1 माह\n• फैमिली पैक: 3 कनेक्शन पर 30% छूट\n\nविवरण: www.horizontelecom.com/offers'
  },
  'discounts': {
    'bn': '💰 Horizon ছাড় ও সেভিংস:\n\n🎓 স্পেশাল ছাড়:\n• শিক্ষার্থী: ২০% ছাড় সব প্ল্যানে\n• সিনিয়র সিটিজেন: ১৫% ছাড়\n• সরকারি কর্মচারী: ১০% ছাড়\n\n💳 পেমেন্ট অফার:\n• বিকাশ/নগদে পেমেন্ট: ৫% ক্যাশব্যাক\n• অটো-পে সেটআপ: ১০০ টাকা বোনাস\n\n🎁 লয়্যালটি প্রোগ্রাম:\n• ১ বছর: ১০% লাইফটাইম ছাড়\n• ২ বছর: ১৫% লাইফটাইম ছাড়\n\nপ্রমোকোড ব্যবহার করুন: HORIZON25',
    'en': '💰 Horizon Discounts & Savings:\n\n🎓 Special Discounts:\n• Students: 20% off all plans\n• Senior Citizens: 15% off\n• Govt Employees: 10% off\n\n💳 Payment Offers:\n• bKash/Nagad payment: 5% cashback\n• Auto-pay setup: ৳100 bonus\n\n🎁 Loyalty Program:\n• 1 year: 10% lifetime discount\n• 2 years: 15% lifetime discount\n\nUse promo code: HORIZON25',
    'hi': '💰 Horizon छूट और बचत:\n\n🎓 विशेष छूट:\n• छात्र: सभी प्लान पर 20% छूट\n• वरिष्ठ नागरिक: 15% छूट\n• सरकारी कर्मचारी: 10% छूट\n\n💳 भुगतान ऑफर:\n• bKash/Nagad भुगतान: 5% कैशबैक\n• ऑटो-पे सेटअप: ৳100 बोनस\n\n🎁 वफादारी कार्यक्रम:\n• 1 वर्ष: 10% आजीवन छूट\n• 2 वर्ष: 15% आजीवन छूट\n\nप्रोमो कोड उपयोग करें: HORIZON25'
  },
  // Billing & Account Management
  'bill_check': {
    'bn': '📱 বিল চেক করার উপায়:\n\n✅ তাৎক্ষণিক:\n• *১২১# ডায়াল করুন\n• SMS পাঠান "BILL" ১২১ নম্বরে\n\n📲 Horizon অ্যাপ:\n• লগইন করুন\n• "My Account" → "Bill History"\n• বিস্তারিত বিল ও পেমেন্ট হিস্টরি দেখুন\n\n💻 অনলাইন:\n• www.horizontelecom.com/myaccount\n• আপনার নম্বর দিয়ে লগইন করুন\n\nবিল পরিশোধ করতে *১২২# ডায়াল করুন।',
    'en': '📱 Ways to Check Bill:\n\n✅ Instant:\n• Dial *121#\n• SMS "BILL" to 121\n\n📲 Horizon App:\n• Login to app\n• "My Account" → "Bill History"\n• View detailed bills & payment history\n\n💻 Online:\n• www.horizontelecom.com/myaccount\n• Login with your number\n\nPay bill via *122# or app.',
    'hi': '📱 बिल जांचने के तरीके:\n\n✅ तत्काल:\n• *121# डायल करें\n• 121 पर "BILL" SMS करें\n\n📲 Horizon ऐप:\n• ऐप में लॉगिन करें\n• "My Account" → "Bill History"\n• विस्तृत बिल और भुगतान इतिहास देखें\n\n💻 ऑनलाइन:\n• www.horizontelecom.com/myaccount\n• अपने नंबर से लॉगिन करें\n\nबिल भुगतान के लिए *122# डायल करें।'
  },
  'bill_payment': {
    'bn': '💳 বিল পরিশোধের পদ্ধতি:\n\n📱 মোबাইल পেমেন্ট:\n• বিকাশ: *১২২*১#\n• নগদ: *১২২*২#\n• রকেট: *১২২*৩#\n\n💻 অনলাইন:\n• Horizon অ্যাপ (Card/Mobile Banking)\n• www.horizontelecom.com/paybill\n\n🏪 অফলাইন:\n• যেকোনো Horizon সেন্টার\n• বিকাশ/নগদ এজেন্ট\n• ব্যাংক পেমেন্ট\n\n🔄 অটো-পে সেটআপ:\n*১২৪# ডায়াল করুন এবং মাসিক ১০০ টাকা বোনাস পান!',
    'en': '💳 Bill Payment Methods:\n\n📱 Mobile Payment:\n• bKash: *122*1#\n• Nagad: *122*2#\n• Rocket: *122*3#\n\n💻 Online:\n• Horizon App (Card/Mobile Banking)\n• www.horizontelecom.com/paybill\n\n🏪 Offline:\n• Any Horizon Center\n• bKash/Nagad agents\n• Bank payment\n\n🔄 Auto-Pay Setup:\nDial *124# and get ৳100 monthly bonus!',
    'hi': '💳 बिल भुगतान के तरीके:\n\n📱 मोबाइल भुगतान:\n• bKash: *122*1#\n• Nagad: *122*2#\n• Rocket: *122*3#\n\n💻 ऑनलाइन:\n• Horizon ऐप (कार्ड/मोबाइल बैंकिंग)\n• www.horizontelecom.com/paybill\n\n🏪 ऑफलाइन:\n• कोई भी Horizon सेंटर\n• bKash/Nagad एजेंट\n• बैंक भुगतान\n\n🔄 ऑटो-पे सेटअप:\n*124# डायल करें और ৳100 मासिक बोनस पाएं!'
  },
  'balance_check': {
    'bn': '💰 ব্যালেন্স চেক:\n\n📞 দ্রুত পদ্ধতি:\n• *১২৫# ডায়াল করুন\n• মেইন ব্যালেন্স, ডেটা, মিনিট সব দেখুন\n\n📲 Horizon অ্যাপ:\n• হোম স্ক্রিনে সব কিছু এক নজরে\n• ব্যালেন্স, ডেটা, validity, active packs\n\n💬 SMS:\n• "BAL" পাঠান 125 নম্বরে\n\nরিয়েল-টাইম আপডেটের জন্য অ্যাপ ডাউনলোড করুন!',
    'en': '💰 Balance Check:\n\n📞 Quick Method:\n• Dial *125#\n• View balance, data, minutes all at once\n\n📲 Horizon App:\n• Everything at a glance on home screen\n• Balance, data, validity, active packs\n\n💬 SMS:\n• Send "BAL" to 125\n\nDownload app for real-time updates!',
    'hi': '💰 बैलेंस जांचें:\n\n📞 त्वरित तरीका:\n• *125# डायल करें\n• बैलेंस, डेटा, मिनट सब एक साथ देखें\n\n📲 Horizon ऐप:\n• होम स्क्रीन पर सब कुछ एक नज़र में\n• बैलेंस, डेटा, वैधता, सक्रिय पैक\n\n💬 SMS:\n• 125 को "BAL" भेजें\n\nरियल-टाइम अपडेट के लिए ऐप डाउनलोड करें!'
  },
  'recharge': {
    'bn': '💸 রিচার্জ পদ্ধতি:\n\n📱 মোবাইল রিচার্জ:\n• *১২০*পিন নম্বর# ডায়াল করুন\n• বিকাশ: *১২০*১*পিন#\n• নগদ: *১২০*২*পিন#\n\n📲 Horizon অ্যাপ:\n• "Recharge" সিলেক্ট করুন\n• Card/bKash/Nagad/Rocket সব অপশন\n• প্রথম অ্যাপ রিচার্জে ৫০ টাকা বোনাস!\n\n🏪 অফলাইন:\n• যেকোনো Horizon সেন্টার\n• মোবাইল ব্যাংকিং এজেন্ট\n\nঅটো-রিচার্জ সেটআপ করুন এবং বোনাস পান!',
    'en': '💸 Recharge Methods:\n\n📱 Mobile Recharge:\n• Dial *120*PIN#\n• bKash: *120*1*PIN#\n• Nagad: *120*2*PIN#\n\n📲 Horizon App:\n• Select "Recharge"\n• All options: Card/bKash/Nagad/Rocket\n• First app recharge: ৳50 bonus!\n\n🏪 Offline:\n• Any Horizon Center\n• Mobile banking agents\n\nSet up auto-recharge and get bonuses!',
    'hi': '💸 रिचार्ज के तरीके:\n\n📱 मोबाइल रिचार्ज:\n• *120*PIN# डायल करें\n• bKash: *120*1*PIN#\n• Nagad: *120*2*PIN#\n\n📲 Horizon ऐप:\n• "Recharge" चुनें\n• सभी विकल्प: Card/bKash/Nagad/Rocket\n• पहला ऐप रिचार्ज: ৳50 बोनस!\n\n🏪 ऑफलाइन:\n• कोई भी Horizon सेंटर\n• मोबाइल बैंकिंग एजेंट\n\nऑटो-रिचार्ज सेटअप करें और बोनस पाएं!'
  },
  'account_reset': {
    'bn': '🔐 অ্যাকাউন্ট রিসেট:\n\n📱 পাসওয়ার্ড রিসেট:\n• *১২৬# ডায়াল করুন\n• আপনার ফোন নম্বর ভেরিফাই করুন\n• OTP পাবেন SMS এ\n• নতুন পাসওয়ার্ড সেট করুন\n\n🆔 SIM রিপ্লেসমেন্ট:\n• নিকটস্থ Horizon সেন্টারে যান\n• NID/Passport নিয়ে আসুন\n• ফ্রি SIM রিপ্লেসমেন্ট (পুরনো নম্বর বহাল)\n\n📞 সাহায্য দরকার?\n১৬৩২১ এ কল করুন (24/7 সাপোর্ট)',
    'en': '🔐 Account Reset:\n\n📱 Password Reset:\n• Dial *126#\n• Verify your phone number\n• Receive OTP via SMS\n• Set new password\n\n🆔 SIM Replacement:\n• Visit nearest Horizon Center\n• Bring NID/Passport\n• Free SIM replacement (keep old number)\n\n📞 Need Help?\nCall 16321 (24/7 support)',
    'hi': '🔐 खाता रीसेट:\n\n📱 पासवर्ड रीसेट:\n• *126# डायल करें\n• अपना फोन नंबर सत्यापित करें\n• SMS के माध्यम से OTP प्राप्त करें\n• नया पासवर्ड सेट करें\n\n🆔 SIM प्रतिस्थापन:\n• निकटतम Horizon सेंटर पर जाएं\n• NID/Passport लाएं\n• मुफ्त SIM प्रतिस्थापन (पुराना नंबर बरकरार)\n\n📞 सहायता चाहिए?\n16321 पर कॉल करें (24/7 सहायता)'
  },
  // Network & Technical Support
  'network_issue': {
    'bn': '📶 নেটওয়ার্ক সমস্যা সমাধান:\n\n🔧 দ্রুত সমাধান:\n1. ফোন রিস্টার্ট করুন\n2. Airplane mode ON/OFF করুন\n3. SIM কার্ড বের করে আবার ঢোকান\n4. Network settings রিসেট করুন\n\n📡 এলাকায় নেটওয়ার্ক চেক:\n• *১২৭# ডায়াল করুন\n• এলাকার টাওয়ার স্ট্যাটাস দেখুন\n\n❌ এখনও সমস্যা?\n• হটলাইন: ১৬৩২১\n• অ্যাপে "Report Network Issue"\n• আমরা ২৪ ঘণ্টার মধ্যে ঠিক করে দেব',
    'en': '📶 Network Issue Troubleshooting:\n\n🔧 Quick Fix:\n1. Restart your phone\n2. Toggle Airplane mode ON/OFF\n3. Remove & reinsert SIM card\n4. Reset network settings\n\n📡 Check Network Coverage:\n• Dial *127#\n• View tower status in your area\n\n❌ Still Having Issues?\n• Hotline: 16321\n• App: "Report Network Issue"\n• We\'ll fix it within 24 hours',
    'hi': '📶 नेटवर्क समस्या समाधान:\n\n🔧 त्वरित समाधान:\n1. फोन को पुनः आरंभ करें\n2. Airplane mode ON/OFF करें\n3. SIM कार्ड निकालें और फिर से डालें\n4. नेटवर्क सेटिंग्स रीसेट करें\n\n📡 क्षेत्र में नेटवर्क जांचें:\n• *127# डायल करें\n• अपने क्षेत्र में टॉवर की स्थिति देखें\n\n❌ अभी भी समस्या है?\n• हॉटलाइन: 16321\n• ऐप: "Report Network Issue"\n• हम 24 घंटे में ठीक कर देंगे'
  },
  'internet_slow': {
    'bn': '🐌 ইন্টারনেট স্লো? সমাধান:\n\n✅ চেক করুন:\n• ডেটা ব্যালেন্স: *১২৫#\n• FUP লিমিট শেষ হয়েছে কিনা\n• নেটওয়ার্ক মোড: 4G সিলেক্ট করুন\n\n⚡ স্পিড বাড়ান:\n• Background apps বন্ধ করুন\n• Cache clear করুন\n• নেটওয়ার্ক সেটিংস রিসেট\n\n🚀 স্পিড টেস্ট:\n• Horizon অ্যাপে "Speed Test"\n• আপনার এলাকার গড় স্পিড দেখুন\n\n💡 স্পিড বুস্ট প্যাক:\n*১২৩*১# - ১৯৯ টাকায় ৩ দিন সুপার ফাস্ট',
    'en': '🐌 Internet Slow? Solutions:\n\n✅ Check:\n• Data balance: *125#\n• FUP limit reached?\n• Network mode: Select 4G\n\n⚡ Speed Up:\n• Close background apps\n• Clear cache\n• Reset network settings\n\n🚀 Speed Test:\n• Horizon App: "Speed Test"\n• See average speed in your area\n\n💡 Speed Boost Pack:\n*123*1# - Super fast for 3 days at ৳199',
    'hi': '🐌 इंटरनेट धीमा? समाधान:\n\n✅ जांचें:\n• डेटा बैलेंस: *125#\n• FUP लिमिट पूरी हो गई?\n• नेटवर्क मोड: 4G चुनें\n\n⚡ गति बढ़ाएं:\n• बैकग्राउंड ऐप्स बंद करें\n• कैश क्लियर करें\n• नेटवर्क सेटिंग्स रीसेट करें\n\n🚀 स्पीड टेस्ट:\n• Horizon ऐप: "Speed Test"\n• अपने क्षेत्र की औसत गति देखें\n\n💡 स्पीड बूस्ट पैक:\n*123*1# - ৳199 में 3 दिन सुपर फास्ट'
  },
  'customer_service': {
    'bn': '📞 Horizon কাস্টমার সার্ভিস:\n\n🎧 24/7 হটলাইন:\n• কল করুন: 16321 (ফ্রি)\n• WhatsApp: +880-1XXX-XXXXXX\n\n💬 অনলাইন সাপোর্ট:\n• Live Chat: Horizon অ্যাপ\n• Facebook: @HorizonTelecomBD\n• Email: support@horizontelecom.com\n\n🏪 সার্ভিস সেন্টার:\n• নিকটস্থ সেন্টার খুঁজুন: *১২৮#\n• সময়: সকাল ৯টা - রাত ৯টা\n\n⭐ প্রিমিয়াম সাপোর্ট:\nপোস্টপেইড গ্রাহকদের জন্য ডেডিকেটেড লাইন',
    'en': '📞 Horizon Customer Service:\n\n🎧 24/7 Hotline:\n• Call: 16321 (Free)\n• WhatsApp: +880-1XXX-XXXXXX\n\n💬 Online Support:\n• Live Chat: Horizon App\n• Facebook: @HorizonTelecomBD\n• Email: support@horizontelecom.com\n\n🏪 Service Centers:\n• Find nearest: *128#\n• Hours: 9 AM - 9 PM\n\n⭐ Premium Support:\nDedicated line for postpaid customers',
    'hi': '📞 Horizon ग्राहक सेवा:\n\n🎧 24/7 हॉटलाइन:\n• कॉल करें: 16321 (मुफ्त)\n• WhatsApp: +880-1XXX-XXXXXX\n\n💬 ऑनलाइन सहायता:\n• लाइव चैट: Horizon ऐप\n• Facebook: @HorizonTelecomBD\n• Email: support@horizontelecom.com\n\n🏪 सेवा केंद्र:\n• निकटतम खोजें: *128#\n• समय: सुबह 9 बजे - रात 9 बजे\n\n⭐ प्रीमियम सहायता:\nपोस्टपेड ग्राहकों के लिए समर्पित लाइन'
  },
  'default': {
    'bn': 'Horizon Telecom এ স্বাগতম! 📡\n\nআমি আপনাকে সাহায্য করতে পারি:\n\n📱 প্ল্যান ও প্যাকেজ\n💰 অফার ও ডিসকাউন্ট\n💳 বিল ও পেমেন্ট\n🔄 রিচার্জ ও ব্যালেন্স\n📶 নেটওয়ার্ক সমস্যা\n🔐 অ্যাকাউন্ট ম্যানেজমেন্ট\n\nআপনি কী জানতে চান?',
    'en': 'Welcome to Horizon Telecom! 📡\n\nI can help you with:\n\n📱 Plans & Packages\n💰 Offers & Discounts\n💳 Bills & Payments\n🔄 Recharge & Balance\n📶 Network Issues\n🔐 Account Management\n\nWhat would you like to know?',
    'hi': 'Horizon Telecom में आपका स्वागत है! 📡\n\nमैं आपकी मदद कर सकता हूं:\n\n📱 प्लान और पैकेज\n💰 ऑफर और छूट\n💳 बिल और भुगतान\n🔄 रिचार्ज और बैलेंस\n📶 नेटवर्क समस्याएं\n🔐 खाता प्रबंधन\n\nआप क्या जानना चाहेंगे?'
  }
};

function getDemoResponse(message: string, language: string = 'bn'): string {
  const lowerMessage = message.toLowerCase();

  // Plans & Packages queries
  if (lowerMessage.includes('prepaid') || lowerMessage.includes('প্রিপেইড') || lowerMessage.includes('प्रीपेड')) {
    return demoResponses.prepaid_plans[language];
  } else if (lowerMessage.includes('postpaid') || lowerMessage.includes('পোস্টপেইড') || lowerMessage.includes('पोस्टपेड')) {
    return demoResponses.postpaid_plans[language];
  } else if (lowerMessage.includes('data') || lowerMessage.includes('ডেটা') || lowerMessage.includes('डेटा') || lowerMessage.includes('internet pack')) {
    return demoResponses.data_plans[language];
  } else if (lowerMessage.includes('plan') || lowerMessage.includes('প্ল্যান') || lowerMessage.includes('योजना') || lowerMessage.includes('package') || lowerMessage.includes('প্যাকেজ') || lowerMessage.includes('पैकेज')) {
    return demoResponses.plans_list[language];
  }

  // Offers & Discounts queries
  else if (lowerMessage.includes('offer') || lowerMessage.includes('অফার') || lowerMessage.includes('ऑफर') || lowerMessage.includes('promo') || lowerMessage.includes('bonus')) {
    return demoResponses.offers[language];
  } else if (lowerMessage.includes('discount') || lowerMessage.includes('ছাড়') || lowerMessage.includes('छूट') || lowerMessage.includes('saving') || lowerMessage.includes('cashback')) {
    return demoResponses.discounts[language];
  }

  // Billing & Account Management queries
  else if (lowerMessage.includes('bill') && (lowerMessage.includes('check') || lowerMessage.includes('চেক') || lowerMessage.includes('see') || lowerMessage.includes('view') || lowerMessage.includes('কত'))) {
    return demoResponses.bill_check[language];
  } else if (lowerMessage.includes('bill') && (lowerMessage.includes('pay') || lowerMessage.includes('payment') || lowerMessage.includes('পরিশোধ') || lowerMessage.includes('भुगतान'))) {
    return demoResponses.bill_payment[language];
  } else if (lowerMessage.includes('bill') || lowerMessage.includes('বিল') || lowerMessage.includes('बिल')) {
    return demoResponses.bill_check[language];
  } else if (lowerMessage.includes('balance') || lowerMessage.includes('ব্যালেন্স') || lowerMessage.includes('बैलेंस')) {
    return demoResponses.balance_check[language];
  } else if (lowerMessage.includes('recharge') || lowerMessage.includes('রিচার্জ') || lowerMessage.includes('रिचार्ज') || lowerMessage.includes('top up') || lowerMessage.includes('টপ আপ')) {
    return demoResponses.recharge[language];
  } else if (lowerMessage.includes('account') || lowerMessage.includes('অ্যাকাউন্ট') || lowerMessage.includes('खाता') || lowerMessage.includes('reset') || lowerMessage.includes('রিসেট') || lowerMessage.includes('password')) {
    return demoResponses.account_reset[language];
  }

  // Network & Technical Support queries
  else if (lowerMessage.includes('slow') || lowerMessage.includes('স্লো') || lowerMessage.includes('धीमा') || lowerMessage.includes('speed')) {
    return demoResponses.internet_slow[language];
  } else if (lowerMessage.includes('network') || lowerMessage.includes('নেটওয়ার্ক') || lowerMessage.includes('नेटवर्क') || lowerMessage.includes('signal') || lowerMessage.includes('সিগন্যাল') || lowerMessage.includes('connection')) {
    return demoResponses.network_issue[language];
  }

  // Customer Service queries
  else if (lowerMessage.includes('customer') || lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('সাহায্য') || lowerMessage.includes('সাপোর্ট') || lowerMessage.includes('सहायता') || lowerMessage.includes('contact') || lowerMessage.includes('hotline')) {
    return demoResponses.customer_service[language];
  }

  // Default response
  else {
    return demoResponses.default[language];
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, language = 'bn', outputMode = 'both' } = await req.json();

    console.log('Request:', { message, language, outputMode });

    // Get response (demo mode or AI)
    const responseText = DEMO_MODE ? getDemoResponse(message, language) : 'দুঃখিত, আমি বুঝতে পারিনি।';

    // Only generate audio if outputMode is 'speech' or 'both'
    let audioUrl = null;
    const shouldGenerateAudio = outputMode === 'speech' || outputMode === 'both';

    if (shouldGenerateAudio && ELEVENLABS_API_KEY) {
      const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';

      try {
        console.log('Attempting voice synthesis with voice ID:', VOICE_ID);
        const audioResponse = await axios.post(
          `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
          {
            text: responseText,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          },
          {
            headers: {
              'xi-api-key': ELEVENLABS_API_KEY,
              'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer',
          }
        );

        const audioBase64 = Buffer.from(audioResponse.data).toString('base64');
        audioUrl = `data:audio/mpeg;base64,${audioBase64}`;
        console.log('✅ Voice synthesis successful');
      } catch (voiceError: any) {
        console.error('❌ Voice synthesis failed:', voiceError.response?.data || voiceError.message);
        // Continue without audio
      }
    } else if (shouldGenerateAudio) {
      console.log('⚠️ ElevenLabs API key not found - skipping voice synthesis');
    } else {
      console.log('ℹ️ Text-only mode - skipping voice synthesis');
    }

    return NextResponse.json({
      text: responseText,
      audioUrl: audioUrl,
    });
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    return NextResponse.json(
      {
        error: error.response?.data?.detail || error.message || 'An error occurred',
      },
      { status: 500 }
    );
  }
}
