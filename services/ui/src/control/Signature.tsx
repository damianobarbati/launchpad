import React from 'react';
import type { ControllerProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';
import { Button } from '@ui/component/Button';
import { ICheck, IClose, IDelete, IEdit } from '@ui/component/Icons';
import SignaturePad from 'signature_pad';

type Size = {
  width: number;
  height: number;
};

type SignatureDialogProps = {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  opened: boolean;
};

const SignatureDialog: React.FC<SignatureDialogProps> = ({ value, onChange, onClose, opened }) => {
  const [signaturePad, setSignaturePad] = React.useState<SignaturePad>();
  const [signaturePadSize, setSignaturePadSize] = React.useState<Size>({ width: 0, height: 0 });
  const [signaturePadContainer, setSignaturePadContainer] = React.useState<HTMLDivElement>();

  const canvasRef = React.useCallback((node: HTMLCanvasElement) => {
    if (!node) return;

    const signaturePad = new SignaturePad(node, {
      minWidth: 1,
      penColor: 'black',
    });

    setSignaturePad(signaturePad);
  }, []);

  const signaturePadContainerRef = React.useCallback((node: HTMLDivElement) => {
    setSignaturePadContainer(node);
  }, []);

  const resizeSignaturePad = React.useCallback(() => {
    if (!signaturePadContainer) return;

    const { width, height } = signaturePadContainer.getBoundingClientRect();
    setSignaturePadSize({ width, height });
  }, [signaturePadContainer]);

  const onDelete = React.useCallback(() => {
    signaturePad?.clear();
  }, [signaturePad]);

  const handleChange = React.useCallback(() => {
    const value = signaturePad?.isEmpty() ? '' : signaturePad?.toDataURL() || '';
    onChange(value);
    onClose();
  }, [signaturePad, onChange, onClose]);

  React.useEffect(() => {
    resizeSignaturePad();

    window.addEventListener('resize', resizeSignaturePad);
    return () => {
      window.removeEventListener('resize', resizeSignaturePad);
    };
  }, [resizeSignaturePad]);

  React.useEffect(() => {
    if (opened) {
      resizeSignaturePad();
    }
  }, [opened, resizeSignaturePad]);

  React.useEffect(() => {
    if (opened) {
      if (value) {
        void signaturePad?.fromDataURL(value, { ratio: 1 });
      } else {
        signaturePad?.clear();
      }
    }
  }, [value, signaturePad, opened]);

  return (
    <dialog open={opened} className="bg-grey-light fixed top-0 z-10 h-screen w-screen p-8">
      <div className="flex size-full flex-col justify-center">
        <div className="border-grey-border min-h-[11.75rem] w-full rounded-2xl border bg-white" ref={signaturePadContainerRef}>
          <canvas ref={canvasRef} width={signaturePadSize.width} height={signaturePadSize.height} />
        </div>
        <div className="mt-2 flex w-full flex-row justify-center">
          <div className="flex flex-row flex-wrap gap-4 rounded-full bg-white p-2">
            <Button type="button" className="text-green !w-fit !p-0" onClick={handleChange} LeftIcon={ICheck}>
              Save
            </Button>
            <Button type="button" className="text-red !w-fit !p-0" onClick={onDelete} LeftIcon={IDelete}>
              Clear
            </Button>
            <Button type="button" className="!w-fit !p-0" onClick={onClose} LeftIcon={IClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

type Props = {
  name: string;
  label?: string;
  disabled?: boolean;
  rules?: ControllerProps['rules'];
};

export const Signature: React.FC<Props> = ({ name, label, disabled, rules }) => {
  const [dialogOpened, setDialogOpened] = React.useState(false);

  const { control } = useFormContext();

  const onOpenDialog = React.useCallback(() => {
    setDialogOpened(true);
  }, []);

  const onCloseDialog = React.useCallback(() => {
    setDialogOpened(false);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <React.Fragment>
          <div className="flex w-full flex-col gap-4">
            <span className="caption text-grey-label px-4">{label}</span>
            <Button
              type="button"
              className="border-grey-border relative min-h-[11.75rem] w-full !rounded-2xl border"
              onClick={onOpenDialog}
              disabled={disabled}
            >
              {field.value ? (
                <img src={field.value} className="size-full" />
              ) : (
                !disabled && (
                  <div className="text-grey-placeholder caption flex flex-row gap-2 text-center">
                    <IEdit /> Tap to draw
                  </div>
                )
              )}
            </Button>
            {fieldState.error && <span className="text-red ml-4">{fieldState.error.message}</span>}
          </div>
          <SignatureDialog value={field.value} onChange={field.onChange} onClose={onCloseDialog} opened={dialogOpened} />
        </React.Fragment>
      )}
    />
  );
};
