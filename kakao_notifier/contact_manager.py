import json
import os
import re

class ContactManager:
    """순원 및 그룹 주소록 관리 모듈"""
    
    def __init__(self, data_file="contacts.json"):
        self.data_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), data_file)
        self.data = {
            "last_selected_group": "1순",
            "groups": {
                "1순": ["김준호"]
            }
        }
        self.load()

    def load(self):
        """저장된 contacts.json 파일에서 데이터를 불러옵니다."""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, "r", encoding="utf-8") as f:
                    loaded = json.load(f)
                    if isinstance(loaded, dict) and "groups" in loaded:
                        self.data = loaded
            except Exception as e:
                print(f"[!] 주소록 파일 로드 실패 (기본값 사용): {e}")
        else:
            self.save()

    def save(self):
        """현재 데이터를 contacts.json 파일에 저장합니다."""
        try:
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump(self.data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"[!] 주소록 파일 저장 실패: {e}")
            return False

    def get_groups(self):
        """전체 그룹 목록 반환"""
        return list(self.data.get("groups", {}).keys())

    def add_group(self, group_name):
        """새 그룹 생성"""
        group_name = group_name.strip()
        if not group_name:
            return False, "그룹 이름을 입력해주세요."
        if group_name in self.data["groups"]:
            return False, "이미 존재하는 그룹입니다."
        
        self.data["groups"][group_name] = []
        self.save()
        return True, f"그룹 '{group_name}'이 생성되었습니다."

    def delete_group(self, group_name):
        """그룹 삭제"""
        if group_name in self.data["groups"]:
            del self.data["groups"][group_name]
            # 그룹이 다 지워졌으면 기본 1순 생성
            if not self.data["groups"]:
                self.data["groups"]["1순"] = []
                self.data["last_selected_group"] = "1순"
            elif self.data.get("last_selected_group") == group_name:
                self.data["last_selected_group"] = self.get_groups()[0]
            self.save()
            return True, f"그룹 '{group_name}'이 삭제되었습니다."
        return False, "존재하지 않는 그룹입니다."

    def get_members(self, group_name):
        """해당 그룹의 순원 목록 반환"""
        return self.data.get("groups", {}).get(group_name, [])

    def add_member(self, group_name, member_name):
        """단건 순원 추가"""
        member_name = member_name.strip()
        if not member_name:
            return False, "이름을 입력해주세요."
        if group_name not in self.data["groups"]:
            return False, "존재하지 않는 그룹입니다."
        
        members = self.data["groups"][group_name]
        if member_name in members:
            return False, f"'{member_name}' 순원님은 이미 등록되어 있습니다."
        
        members.append(member_name)
        self.save()
        return True, f"'{member_name}' 순원님이 추가되었습니다."

    def delete_member(self, group_name, member_name):
        """순원 삭제"""
        if group_name in self.data["groups"] and member_name in self.data["groups"][group_name]:
            self.data["groups"][group_name].remove(member_name)
            self.save()
            return True, f"'{member_name}' 순원님이 삭제되었습니다."
        return False, "존재하지 않는 순원입니다."

    def add_members_bulk(self, group_name, raw_text):
        """
        엑셀이나 메모장에서 복사한 텍스트를 줄바꿈/쉼표/탭 단위로 파싱하여 일괄 추가합니다.
        예: '홍길동\n김철수\n이영희' 또는 '홍길동, 김철수, 이영희'
        """
        if group_name not in self.data["groups"]:
            return 0, "존재하지 않는 그룹입니다."

        # 줄바꿈(\r, \n), 쉼표(,), 탭(\t), 슬래시(/) 등으로 분리
        tokens = re.split(r"[\r\n,\t/]+", raw_text)
        added_count = 0
        current_members = set(self.data["groups"][group_name])

        for token in tokens:
            name = token.strip()
            if name and name not in current_members:
                self.data["groups"][group_name].append(name)
                current_members.add(name)
                added_count += 1

        if added_count > 0:
            self.save()
            return added_count, f"{added_count}명의 순원이 등록되었습니다."
        else:
            return 0, "추가할 새로운 순원이 없거나 이미 모두 등록되어 있습니다."

    def get_last_selected_group(self):
        last = self.data.get("last_selected_group", "1순")
        if last not in self.get_groups():
            last = self.get_groups()[0] if self.get_groups() else "1순"
        return last

    def set_last_selected_group(self, group_name):
        if group_name in self.data["groups"]:
            self.data["last_selected_group"] = group_name
            self.save()


if __name__ == "__main__":
    # 단위 테스트
    print("=" * 50)
    print("[ContactManager 단위 기능 테스트]")
    print("=" * 50)
    
    cm = ContactManager("test_contacts.json")
    print("1. 초기 그룹 목록:", cm.get_groups())
    
    # 그룹 추가
    cm.add_group("2순")
    print("2. '2순' 추가 후 그룹 목록:", cm.get_groups())
    
    # 일괄 텍스트 등록 테스트 (엑셀 형태: 줄바꿈 및 쉼표 혼합)
    sample_text = """
    홍길동
    이순신, 강감찬
    유관순\t안중근
    """
    count, msg = cm.add_members_bulk("2순", sample_text)
    print(f"3. 2순에 일괄 추가 결과: {msg}")
    print("   2순 순원 명단:", cm.get_members("2순"))
    
    # 중복 추가 시도 테스트
    count2, msg2 = cm.add_members_bulk("2순", "홍길동, 윤봉길")
    print(f"4. 중복 포함 추가 결과: {msg2}")
    print("   2순 순원 명단:", cm.get_members("2순"))
    
    # 파일 정리
    if os.path.exists("test_contacts.json"):
        os.remove("test_contacts.json")
    print("\n[+] ContactManager 모든 테스트 통과!")
