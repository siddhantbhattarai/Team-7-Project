/* eslint-disable import/no-extraneous-dependencies */
// sections

'use client';

import { rSuiteComponents } from '@react-form-builder/components-rsuite';
import { BuilderView, FormBuilder, IFormBuilder } from '@react-form-builder/designer';
import { useRef } from 'react';

const components = rSuiteComponents.map((c) => c.build());
const builderView = new BuilderView(components);
// ----------------------------------------------------------------------

// export const metadata = {
//   title: 'Dashboard: Forms List',
// };

export default function FormListPage() {
  const builderRef = useRef<IFormBuilder>();

  const setRef = (builder: IFormBuilder | null) => {
    if (builder) {
      builderRef.current = builder;
      const formJSON = builder?.formAsString;
      console.log('JSON is', formJSON);
    }
  };
  return <FormBuilder view={builderView} />;
}
