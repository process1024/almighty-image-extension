import { Select } from 'antd';

import useViewModel from './viewModel';

type HBTagInputProps = Record<string, unknown>;

/**
 *
 * @param {Object} props 支持 Select 所有参数
 * @param {Array<string>} props.suggestTags 推荐标签名列表
 * @param {Array<string>} props.tagsToSelect 可供下拉选择的标签列表
 * @param {boolean} props.suggestVisible "推荐"是否可见, 默认true
 * @param {boolean} props.useLabel 是否开启label效果，默认false， 使用placeholder作为label
 * @param {string} props.labelBackground label的背景色，默认white
 * @param {string[]} props.tags 标签列表
 * @returns {JSX.Element}
 * @constructor
 */
export default function HBTagInput(props: HBTagInputProps) {
  const {
    placeholder,
    allowClear,
    useLabel,
    disabled,
    searchValue,

    onSelectChange,
    onSearchChange,

    options,
    tags,
    open,
    onFocus,
    onBlur,
    selectProps = {},
  } = useViewModel(props);

  return (
    <Select
      mode={'tags'}
      // className={styles.editArea}
      bordered={false}
      placeholder={useLabel ? undefined : placeholder}
      onChange={onSelectChange}
      value={tags}
      allowClear={allowClear}
      open={open}
      disabled={disabled}
      searchValue={searchValue}
      onSearch={onSearchChange}
      onFocus={onFocus}
      {...selectProps}
      onBlur={onBlur}>
      {options}
    </Select>
  );
}
