import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { List } from '@gw2treasures/ui/components/Layout/List';

export default function PrivacyPage() {
  return (
    <HeroLayout hero={<Headline id="privacy">Privacy Policy</Headline>} toc>
      <p>Last updated January 2, 2024</p>

      <p>At gw2treasures.com one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by gw2treasures.com and how we use it.</p>

      <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>

      <p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in gw2treasures.com. This policy is not applicable to any information collected offline or via channels other than this website.</p>

      <Headline id="consent">Consent</Headline>

      <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>

      <Headline id="info">Information we collect</Headline>

      <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
      <p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>
      <p>When you register for an Account, we may ask for your contact information, including items such as username and email address.</p>

      <Headline id="use">How we use your information</Headline>

      <p>We use the information we collect in various ways, including to:</p>

      <List>
        <li>Provide, operate, and maintain our website</li>
        <li>Improve, personalize, and expand our website</li>
        <li>Understand and analyze how you use our website</li>
        <li>Develop new products, services, features, and functionality</li>
        <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
        <li>Send you emails</li>
        <li>Find and prevent fraud</li>
      </List>

      <Headline id="log">Log Files</Headline>

      <p>gw2treasures.com follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services&apos; analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users&apos; movement on the website, and gathering demographic information.</p>

      <Headline id="cookies">Cookies and Web Beacons</Headline>

      <p>Like any other website, gw2treasures.com uses &quot;cookies&quot;. These cookies are used to store information essential to operating this website.</p>


      <Headline id="third-party">Third Party Privacy Policies</Headline>

      <p>gw2treasures.com&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-parties for more detailed information. It may include their practices and instructions about how to opt-out of certain options. </p>

      <Headline id="ccpa">CCPA Privacy Rights (Do Not Sell My Personal Information)</Headline>

      <p>Under the CCPA, among other rights, California consumers have the right to:</p>
      <p>Request that a business that collects a consumer&apos;s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</p>
      <p>Request that a business delete any personal data about the consumer that a business has collected.</p>
      <p>Request that a business that sells a consumer&apos;s personal data, not sell the consumer&apos;s personal data.</p>
      <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>

      <Headline id="gdpr">GDPR Data Protection Rights</Headline>

      <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
      <p>The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.</p>
      <p>The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</p>
      <p>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</p>
      <p>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</p>
      <p>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</p>
      <p>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</p>
      <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>

      <Headline id="children">Children&apos;s Information</Headline>

      <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>

      <p>gw2treasures.com does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>

      <Headline id="changes">Changes to This Privacy Policy</Headline>

      <p>We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.</p>

      <Headline id="contact">Contact Us</Headline>

      <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <a href="mailto:support@gw2treasures.com">support@gw2treasures.com</a>.</p>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'Privacy Policy',
  description: 'Last updated January 2, 2024',
};
