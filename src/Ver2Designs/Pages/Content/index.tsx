import * as React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import ContentCreator from './ContentCreator';
import { TermsOfUse, PrivacyPolicy } from '../../../content-page-data';

const PageData = {
  TermsOfUse,
  PrivacyPolicy,
};

const ContentPage = (props: { page: keyof typeof PageData }) => {
  return (
    <div id='content-page'>
      <Header />
      <main>
        <ContentCreator
          //@ts-ignore
          data={PageData[props.page]}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ContentPage;
