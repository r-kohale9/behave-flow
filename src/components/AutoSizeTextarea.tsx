import {
  CSSProperties,
  FC,
  HTMLProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type AutoSizeInputProps = HTMLProps<HTMLTextAreaElement> & {
  minWidth?: number;
  maxWidth?: number;
};

const baseStyles: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  visibility: "hidden",
  height: 0,
  width: "auto",
  whiteSpace: "pre",
};

export const AutoSizeTextarea: FC<AutoSizeInputProps> = ({
  minWidth = 60,
  maxWidth = 200,
  ...props
}) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [styles, setStyles] = useState<CSSProperties>({});


  const setTextareaRef = useCallback((input: HTMLTextAreaElement | null) => {
    if (input) {
      const styles = window.getComputedStyle(input);
      setStyles({
        fontSize: styles.getPropertyValue("font-size"),
        paddingLeft: styles.getPropertyValue("padding-left"),
        paddingRight: styles.getPropertyValue("padding-right"),
      });
    }
    inputRef.current = input;
  }, []);

  // measure the text on change and update input
  useEffect(() => {
    if (measureRef.current === null) return;
    if (inputRef.current === null) return;

    const width = measureRef.current.clientWidth;
    inputRef.current.style.width = Math.max(minWidth, width) + "px";
    inputRef.current.style.maxWidth = maxWidth + "px";
  }, [props.value, minWidth, styles]);

  return (
    <>
      <textarea ref={setTextareaRef} {...props} />
      <span ref={measureRef} style={{ ...baseStyles, ...styles }}>
        {props.value}
      </span>
    </>
  );
};
