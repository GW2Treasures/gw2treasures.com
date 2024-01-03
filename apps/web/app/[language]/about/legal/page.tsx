import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';

export default function LegalPage() {
  return (
    <HeroLayout hero={(<Headline id="legal">Legal Notice</Headline>)} toc>
      <p>Last updated January 2, 2024</p>

      <Headline id="contact">Contact</Headline>
      <p>Email: <a href="mailto:support@gw2treasures.com">support@gw2treasures.com</a></p>

      <Headline id="content">Liability for Content</Headline>
      <p>The contents of our website have been created with the greatest possible care. However, we cannot guarantee the contents&apos; accuracy, completeness, or topicality. According to Section 7, paragraph 1 of the TMG (Telemediengesetz - German Telemedia Act), we as service providers are liable for our content on these pages by general laws. However, according to Sections 8 to 10 of the TMG, we service providers are not obliged to monitor external information transmitted or stored or investigate circumstances pointing to illegal activity. Obligations to remove or block the use of information under general laws remain unaffected. However, a liability in this regard is only possible from the moment of knowledge of a specific infringement. Upon notification of such violations, we will remove the content immediately.</p>

      <Headline id="links">Liability for Links</Headline>
      <p>Our website contains links to external websites, over whose contents we have no control. Therefore, we cannot accept any liability for these external contents. The respective provider or operator of the websites is always responsible for the contents of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal contents were not identified at the time of linking. However, permanent monitoring of the contents of the linked pages is not reasonable without specific indications of a violation. Upon notification of violations, we will remove such links immediately.</p>

      <Headline id="copyright">Copyright</Headline>
      <p>The contents and works on these pages created by the site operator are subject to German copyright law. The duplication, processing, distribution, and any kind of utilization outside the limits of copyright require the written consent of the respective author or creator. Downloads and copies of these pages are only permitted for private, non-commercial use. In so far as the contents on this site were not created by the operator, the copyrights of third parties are respected. In particular, third-party content is marked as such. Should you become aware of a copyright infringement, please inform us accordingly. Upon notification of violations, we will remove such contents immediately.</p>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'Legal Notice',
  description: 'Last updated January 2, 2024',
};
