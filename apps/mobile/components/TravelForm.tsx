import React, { useState, useEffect } from 'react';
import styles from './TravelForm.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 타입 정의
interface TravelFormProps {
  mode: 'create' | 'edit';
  travelData?: {
    title: string;
    location: string;
    countries?: string[];
    startDate: string;
    endDate: string;
  };
}

export default function TravelForm({ mode, travelData }: TravelFormProps) {
  const router = useRouter();

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    title: '',
    location: 'domestic',
    countries: [] as string[],
    startDate: '2024-10-28',
    endDate: '2024-11-02',
  });

  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // 임시 국가 데이터 (실제로는 API에서 가져와야 함)
  const countriesList = ['오스트리아', '스위스', '포르투갈', '프랑스', '이탈리아', '스페인'];

  // 여행 편집 모드일 때 기존 데이터를 폼에 채워넣기
  useEffect(() => {
    if (mode === 'edit' && travelData) {
      setFormData({
        title: travelData.title,
        location: travelData.location === 'domestic' ? 'domestic' : 'overseas',
        countries: travelData.countries || [],
        startDate: travelData.startDate,
        endDate: travelData.endDate,
      });
    }
  }, [mode, travelData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (location: 'domestic' | 'overseas') => {
    setFormData((prev) => ({
      ...prev,
      location,
      countries: [], // 위치 변경 시 선택된 국가 초기화
    }));
    setSearchQuery(''); // 검색어 초기화
  };

  // 검색어 변경 처리
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const filtered = countriesList.filter(country =>
        country.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  // 국가 선택 처리
  const handleCountrySelect = (country: string) => {
    if (!formData.countries.includes(country)) {
      setFormData(prev => ({
        ...prev,
        countries: [...prev.countries, country]
      }));
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  // 선택된 국가 제거
  const removeCountry = (countryToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      countries: prev.countries.filter(country => country !== countryToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create') {
      // 여행 생성 로직
      console.log('여행 생성:', formData);
    } else {
      // 여행 편집 로직
      console.log('여행 편집:', formData);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>여행명</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="여행명"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>여행지</label>
          <div className={styles.locationButtons}>
            <button
              type="button"
              className={`${styles.locationButton} ${formData.location === 'domestic' ? styles.active : ''}`}
              onClick={() => handleLocationChange('domestic')}
            >
              국내
            </button>
            <button
              type="button"
              className={`${styles.locationButton} ${formData.location === 'overseas' ? styles.active : ''}`}
              onClick={() => handleLocationChange('overseas')}
            >
              해외
            </button>
          </div>

          {formData.location === 'overseas' && (
            <div className={styles.searchSection}>
              <div className={styles.searchInputWrapper}>
                <input
                  type="text"
                  placeholder="국가 검색"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`${styles.input} ${styles.searchInput}`}
                />
                <span className={styles.searchIcon}>🔍</span>
              </div>

              {/* 선택된 국가 태그 */}
              <div className={styles.selectedCountries}>
                {formData.countries.map((country) => (
                  <div key={country} className={styles.countryTag}>
                    {country}
                    <button
                      type="button"
                      onClick={() => removeCountry(country)}
                      className={styles.removeTag}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* 검색 결과 */}
              {searchQuery && searchResults.length > 0 && (
                <div className={styles.searchResults}>
                  {searchResults.map((country) => (
                    <div
                      key={country}
                      className={styles.searchResultItem}
                      onClick={() => handleCountrySelect(country)}
                    >
                      {country}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label>기간</label>
          <div className={styles.dateGroup}>
            <div className={styles.dateInput}>
              <span>시작일</span>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.dateInput}>
              <span>종료일</span>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          {mode === 'create' ? '여행 생성 완료' : '여행 편집 완료'}
        </button>
      </form>
    </div>
  );
}