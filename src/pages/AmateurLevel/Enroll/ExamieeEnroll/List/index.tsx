import React, { useMemo } from 'react';

import EnrollListItem from './Item';

interface EnrollListProps {
  examineeList: any,
  amateurExaminationDataItem: any
}

const EnrollList = (props: EnrollListProps) => {
  const { examineeList, amateurExaminationDataItem } = props;

  const optionMapping = useMemo(() => {
    if (amateurExaminationDataItem) {
      return amateurExaminationDataItem.map((item: any) => ({
        value: item.id,
        label: `${item['clas_name']} - ${item['level_name']}`
      }))
    }
    return [];
  }, [amateurExaminationDataItem])

  return (
    <>
      {
        examineeList && examineeList.map((examinee: any) => (
          <div>
            <EnrollListItem
              examinee={examinee}
              optionMapping={optionMapping}
            />
          </div>
        ))
      }
    </>
  )
}

export default EnrollList;

