import { Modal } from "@/components/Modal/modal";
import styles from "./radiusModal.module.css";
import { HomeSearchRadiusKm } from "@/type/radius";

const SEARCH_RADIUS_OPTIONS = [
  HomeSearchRadiusKm.TWO,
  HomeSearchRadiusKm.FIVE,
  HomeSearchRadiusKm.TEN,
] as const;

type RadiusModalProps = {
  onClose: () => void;
  onSelectRadius: (radius: HomeSearchRadiusKm) => void;
  selectedRadius: HomeSearchRadiusKm;
};

function formatRadius(radius: HomeSearchRadiusKm) {
  return `${radius}km`;
}

export function RadiusModal({
  onClose,
  onSelectRadius,
  selectedRadius,
}: RadiusModalProps) {
  return (
    <Modal
      title="검색 반경을 선택해 주세요"
      description="도서관을 찾을 범위를 2km, 5km, 10km 중에서 고를 수 있어요."
      onClose={onClose}
      modalClassName={styles.modal}
    >
      <div className={styles.radiusOptions}>
        {SEARCH_RADIUS_OPTIONS.map((radius) => (
          <button
            key={radius}
            type="button"
            className={`${styles.radiusOption} ${
              selectedRadius === radius ? styles.selectedOption : ""
            }`}
            onClick={() => {
              onSelectRadius(radius);
              onClose();
            }}
          >
            {formatRadius(radius)}
          </button>
        ))}
      </div>
      <p className={styles.modalHint}>
        현재 선택된 검색 반경은 <strong>{formatRadius(selectedRadius)}</strong>
        입니다.
      </p>
    </Modal>
  );
}
