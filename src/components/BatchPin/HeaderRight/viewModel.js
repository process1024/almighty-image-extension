import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Select } from 'antd';
import { useMemoizedFn, useGetState, useMount, useUnmount } from 'ahooks';
// import { isSpace, isEnter } from "@/utils/keyBoard";
const isKey = (config) => (e) => {
  for (const [key, value] of Object.entries(config)) {
    if (Array.isArray(value)) {
      if (value.includes(e[key])) return true;
    } else {
      if (e[key] === value) return true;
    }
  }
  return false;
};

const isSpace = isKey({ code: 'Space', keyCode: 32 });
function isEnter(e) {
  return e.code
    ? e.code === 'Enter' || e.code === 'NumpadEnter'
    : e.keyCode === 13;
}

export default function useViewModel(props) {
  const {
    suggestTags,
    tagsToSelect,
    suggestVisible: sv,
    onChange,
    tags: _tags,
    disabled,
  } = props;

  const [searchValue, setSearchValue, getSearchValue] = useGetState('');

  const [tags, setTags, getTags] = useGetState([]);
  const [options, setOptions] = useState(
    (tagsToSelect ?? []).map((tag) => (
      <Select.Option key={tag} value={tag}>
        {tag}
      </Select.Option>
    )),
  );

  const isFocused = useRef(false);
  const usingInputMethod = useRef(false);

  const onFocus = useMemoizedFn(() => {
    isFocused.current = true;
  });
  const onBlur = useMemoizedFn(() => {
    isFocused.current = false;
  });

  const suggestVisible = useMemo(() => sv ?? true, [sv]);

  const onSuggestTagClick = useCallback(
    (e) => {
      if (disabled) return;
      const newTag = e.target.dataset['tag'];
      if (tags.includes(newTag)) return;
      const newTags = [...tags, newTag];
      setTags(newTags);
      if (onChange) {
        requestAnimationFrame(() => onChange([...newTags]));
      }
    },
    [disabled, tags, setTags, onChange],
  );

  const onSelectChange = useCallback(
    (value) => {
      setSearchValue('');
      const _tags = [...(tagsToSelect || [])];
      for (const val of value) {
        if (!_tags.includes(val)) _tags.push(val);
      }

      setTags(value);
      setOptions(
        _tags.map((tag) => (
          <Select.Option key={tag} value={tag}>
            {tag}
          </Select.Option>
        )),
      );
      if (onChange) {
        requestAnimationFrame(() => onChange(value));
      }
    },
    [setSearchValue, tagsToSelect, setTags, onChange],
  );

  const keydownListener = useMemoizedFn((e) => {
    if (
      !isFocused.current
      || !(isSpace(e) || isEnter(e))
      || usingInputMethod.current
    ) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    const newTag = getSearchValue();
    if (newTag.trim() === '') {
      return;
    }

    const tags = getTags();
    setSearchValue('');
    if (tags.includes(newTag)) return;
    tags.push(newTag);
    setTags([...tags]);
    if (onChange) {
      onChange([...tags]);
    }
  });

  const compositionStartHandler = useMemoizedFn(() => {
    if (!isFocused.current) return;

    usingInputMethod.current = true;
  });
  const compositionEndHandler = useMemoizedFn(() => {
    if (!isFocused.current) return;

    usingInputMethod.current = false;
  });

  useMount(() => {
    document.addEventListener('keydown', keydownListener, true);
    document.addEventListener('compositionstart', compositionStartHandler);
    document.addEventListener('compositionend', compositionEndHandler);
  });
  useUnmount(() => {
    document.removeEventListener('keydown', keydownListener, true);
    document.removeEventListener('compositionstart', compositionStartHandler);
    document.removeEventListener('compositionend', compositionEndHandler);
  });

  useEffect(() => {
    setTags([...(_tags ?? [])]);
  }, [_tags, setTags]);

  return {
    ...props,
    suggestVisible,
    suggestTags,
    options,
    tags,
    searchValue,

    onSuggestTagClick,
    onSelectChange,
    onSearchChange: setSearchValue,
    onFocus,
    onBlur,
  };
}
