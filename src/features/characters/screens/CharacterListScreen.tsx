import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getCharacters } from '../../../api/endpoints';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { SkeletonList } from '../../../components/SkeletonList';
import { useDebounce } from '../../../hooks/useDebounce';
import { useHideHeaderOnScroll } from '../../../hooks/useHideHeaderOnScroll';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setGender, setSearch, setStatus } from '../../../store/slices/uiSlice';
import type { CharacterFilters } from '../../../types/api';
import { CharacterCard } from '../components/CharacterCard';

interface Props {
  onCharacterPress: (id: number) => void;
}

/** Character listing with debounce search, filters, and infinite loading. */
export function CharacterListScreen({ onCharacterPress }: Props) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.ui.filters);
  const debouncedSearch = useDebounce(filters.search, 300);
  const { translateY, onScroll } = useHideHeaderOnScroll(100);
  const [activeMenu, setActiveMenu] = useState<'status' | 'gender' | null>(null);
  const lastEndReachedAt = useRef(0);

  const queryFilters = useMemo<CharacterFilters>(
    () => ({ ...filters, search: debouncedSearch }),
    [debouncedSearch, filters],
  );

  const charactersQuery = useInfiniteQuery({
    queryKey: ['characters', queryFilters],
    queryFn: ({ pageParam }) => getCharacters({ page: pageParam, filters: queryFilters }),
    initialPageParam: 1,
    getNextPageParam: last => {
      if (!last.info.next) {
        return undefined;
      }
      const page = new URL(last.info.next).searchParams.get('page');
      return page ? Number(page) : undefined;
    },
  });

  const characters = charactersQuery.data?.pages.flatMap(page => page.results) ?? [];
  const errorMessage =
    charactersQuery.isError
      ? (charactersQuery.error instanceof Error ? charactersQuery.error.message : String(charactersQuery.error))
      : '';
  const isNoResultError = /there is nothing here/i.test(errorMessage);
  const hasQueryError = charactersQuery.isError && !isNoResultError;

  if (charactersQuery.isPending && characters.length === 0) {
    return <SkeletonList />;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
        <TextInput
          style={styles.search}
          value={filters.search}
          onChangeText={value => dispatch(setSearch(value))}
          placeholder="Search characters"
        />
        <View style={styles.filterRow}>
          <FilterSelectButton
            label={`Status: ${formatFilterValue(filters.status)}`}
            onPress={() => setActiveMenu('status')}
          />
          <FilterSelectButton
            label={`Gender: ${formatFilterValue(filters.gender)}`}
            onPress={() => setActiveMenu('gender')}
          />
        </View>
      </Animated.View>
      <Animated.FlatList
        contentContainerStyle={styles.list}
        data={hasQueryError ? [] : characters}
        keyExtractor={item => item.id.toString()}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onEndReached={() => {
          const now = Date.now();
          if (now - lastEndReachedAt.current < 800) {
            return;
          }
          lastEndReachedAt.current = now;
          if (charactersQuery.hasNextPage && !charactersQuery.isFetchingNextPage) {
            charactersQuery.fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.25}
        renderItem={({ item }) => <CharacterCard character={item} onPress={onCharacterPress} />}
        ListEmptyComponent={
          hasQueryError ? (
            <ErrorState message={errorMessage} onRetry={charactersQuery.refetch} />
          ) : (
            <View style={styles.emptyWrap}>
              <EmptyState title="No results found" subtitle="No character matches this search/filter." />
              <Pressable
                style={styles.clearButton}
                onPress={() => {
                  dispatch(setSearch(''));
                  dispatch(setStatus(''));
                  dispatch(setGender(''));
                }}>
                <Text style={styles.clearButtonText}>Clear search and filters</Text>
              </Pressable>
            </View>
          )
        }
      />
      <FilterMenu
        title="Select Status"
        visible={activeMenu === 'status'}
        value={filters.status}
        options={['', 'alive', 'dead', 'unknown']}
        onClose={() => setActiveMenu(null)}
        onSelect={next => dispatch(setStatus(next as CharacterFilters['status']))}
      />
      <FilterMenu
        title="Select Gender"
        visible={activeMenu === 'gender'}
        value={filters.gender}
        options={['', 'female', 'male', 'unknown']}
        onClose={() => setActiveMenu(null)}
        onSelect={next => dispatch(setGender(next as CharacterFilters['gender']))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FB' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    backgroundColor: '#F5F8FB',
    padding: 12,
  },
  search: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 10 },
  filterRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  filterButton: { backgroundColor: '#E4EBF3', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  filterText: { fontWeight: '600' },
  list: { paddingTop: 112, paddingBottom: 20 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'flex-end',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  menuTitle: { fontWeight: '700', fontSize: 16, marginBottom: 8 },
  optionButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E4EBF3',
  },
  optionText: { color: '#334155', fontWeight: '600' },
  optionTextActive: { color: '#1777F2' },
  emptyWrap: { marginTop: 20, paddingHorizontal: 12 },
  clearButton: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#1777F2',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  clearButtonText: { color: '#FFFFFF', fontWeight: '700' },
});

function formatFilterValue(value: string) {
  return value ? value[0].toUpperCase() + value.slice(1) : 'All';
}

function FilterSelectButton(props: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.filterButton} onPress={props.onPress}>
      <Text style={styles.filterText}>{props.label} ▼</Text>
    </Pressable>
  );
}

function FilterMenu(props: {
  title: string;
  visible: boolean;
  value: string;
  options: string[];
  onClose: () => void;
  onSelect: (nextValue: string) => void;
}) {
  return (
    <Modal visible={props.visible} transparent animationType="slide" onRequestClose={props.onClose}>
      <Pressable style={styles.modalBackdrop} onPress={props.onClose}>
        <Pressable style={styles.menuCard} onPress={() => null}>
          <Text style={styles.menuTitle}>{props.title}</Text>
          {props.options.map(option => {
            const optionLabel = formatFilterValue(option);
            const selected = option === props.value;
            return (
              <Pressable
                key={option || 'all'}
                style={styles.optionButton}
                onPress={() => {
                  props.onSelect(option);
                  props.onClose();
                }}>
                <Text style={[styles.optionText, selected ? styles.optionTextActive : undefined]}>
                  {optionLabel}
                </Text>
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
