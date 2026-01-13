'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  type ModalProps,
  type ModalContentProps,
} from '@chakra-ui/react';

export interface GlassModalProps extends ModalProps {}

/**
 * GlassModal is a Modal component with glassmorphism styling.
 * The overlay has a blur effect and the content has frosted glass appearance.
 *
 * @example
 * ```tsx
 * <GlassModal isOpen={isOpen} onClose={onClose}>
 *   <GlassModalOverlay />
 *   <GlassModalContent>
 *     <GlassModalHeader>Modal Title</GlassModalHeader>
 *     <GlassModalCloseButton />
 *     <GlassModalBody>
 *       Modal content goes here...
 *     </GlassModalBody>
 *     <GlassModalFooter>
 *       <GlassButton onClick={onClose}>Close</GlassButton>
 *     </GlassModalFooter>
 *   </GlassModalContent>
 * </GlassModal>
 * ```
 */
export function GlassModal(props: GlassModalProps) {
  return <Modal {...props} />;
}

GlassModal.displayName = 'GlassModal';

// Re-export all Modal sub-components with Glass prefix for consistency
export {
  ModalOverlay as GlassModalOverlay,
  ModalContent as GlassModalContent,
  ModalHeader as GlassModalHeader,
  ModalBody as GlassModalBody,
  ModalFooter as GlassModalFooter,
  ModalCloseButton as GlassModalCloseButton,
};

export type { ModalContentProps as GlassModalContentProps };
