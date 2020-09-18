import React, { memo } from 'react';
import { areEqual, FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ReactTableDefaults } from 'react-table-6';
import { get } from '@caesar/common/utils/utils';

const ITEM_HEIGHT = 40;

const FixedSizeItem = memo(({ data, index, style }) => {
  const { items } = data;
  const item = items[index];

  return (
    <div key={index} style={style}>
      {item}
    </div>
  );
}, areEqual);

const TbodyComponent = props => {
  const {
    // eslint-disable-next-line
    children: [items, _],
    itemSize = ITEM_HEIGHT,
    ...restProps
  } = props;

  const itemData = {
    items,
  };

  return (
    <ReactTableDefaults.TbodyComponent {...restProps}>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={items.length}
            itemData={itemData}
            itemSize={itemSize}
          >
            {FixedSizeItem}
          </FixedSizeList>
        )}
      </AutoSizer>
    </ReactTableDefaults.TbodyComponent>
  );
};

export const VirtualizedTableHOC = Component => {
  return class RTVirtualizedTable extends React.Component {
    getTbodyProps = state => {
      const { expanded, pageRows } = state;
      const flattenPageRows = (rows, path = []) =>
        rows
          .map((row, i) => {
            const subRows = row._subRows ? row._subRows : [];
            const nestingPath = [...path, i];
            const isExpanded = get(expanded, nestingPath);
            const nestedRows = isExpanded
              ? flattenPageRows(subRows, [...path, i])
              : [];

            return [
              {
                row,
                index: i,
                path,
              },
              ...nestedRows,
            ];
          })
          .reduce((result, chunk) => result.concat(chunk), []);

      return {
        rows: flattenPageRows(pageRows),
      };
    };

    render() {
      return (
        <Component
          functionalRowRendering
          getTbodyProps={this.getTbodyProps}
          TbodyComponent={TbodyComponent}
          {...this.props}
        />
      );
    }
  };
};
