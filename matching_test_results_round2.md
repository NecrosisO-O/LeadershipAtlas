# 第二阶段：人工构造答卷测试结果（修正版）

说明：本轮采用“以预期人物完整答卷为底稿，再覆盖关键特征项”的完整测试输入，避免稀疏答卷造成失真。

## case_01_populist_strongman｜民粹强人型
- 预期对象：donald_trump
- 最佳预期排名：1
- 判定：强通过
- 综合 Top 3：
  - donald_trump | overall=0.965 | style=0.987 | ideology=0.944
  - kim_jong_un | overall=0.888 | style=0.939 | ideology=0.837
  - mao_zedong | overall=0.874 | style=0.925 | ideology=0.823

## case_02_totalitarian_security_state｜极权高压国家型
- 预期对象：joseph_stalin
- 最佳预期排名：4
- 判定：不通过
- 综合 Top 3：
  - mobutu_sese_seko | overall=0.954 | style=0.935 | ideology=0.973
  - adolf_hitler | overall=0.942 | style=0.928 | ideology=0.956
  - park_chung_hee | overall=0.891 | style=0.989 | ideology=0.793

## case_03_dynastic_security_state｜封闭世袭安全国家型
- 预期对象：kim_jong_un
- 最佳预期排名：1
- 判定：强通过
- 综合 Top 3：
  - kim_jong_un | overall=0.998 | style=1.000 | ideology=0.996
  - mobutu_sese_seko | overall=0.973 | style=0.946 | ideology=1.000
  - joseph_stalin | overall=0.958 | style=0.958 | ideology=0.959

## case_04_sovereignty_competition_state｜主权竞争型强国家领导人
- 预期对象：vladimir_putin
- 最佳预期排名：1
- 判定：强通过
- 综合 Top 3：
  - vladimir_putin | overall=0.932 | style=0.989 | ideology=0.874
  - joseph_stalin | overall=0.891 | style=0.877 | ideology=0.905
  - mobutu_sese_seko | overall=0.890 | style=0.856 | ideology=0.923

## case_05_institutional_consensus_builder｜制度协商型建制领导人
- 预期对象：angela_merkel
- 最佳预期排名：1
- 判定：强通过
- 综合 Top 3：
  - angela_merkel | overall=0.989 | style=1.000 | ideology=0.978
  - franklin_d_roosevelt | overall=0.879 | style=0.922 | ideology=0.836
  - nelson_mandela | overall=0.866 | style=0.933 | ideology=0.798

## case_06_developmental_state_capacity｜国家能力—绩效主义发展型
- 预期对象：lee_kuan_yew
- 最佳预期排名：2
- 判定：可接受
- 综合 Top 3：
  - vladimir_putin | overall=0.885 | style=0.872 | ideology=0.897
  - lee_kuan_yew | overall=0.883 | style=1.000 | ideology=0.765
  - mobutu_sese_seko | overall=0.874 | style=0.861 | ideology=0.888

## case_07_developmental_authoritarian_builder｜发展主义威权建国型
- 预期对象：park_chung_hee
- 最佳预期排名：4
- 判定：不通过
- 综合 Top 3：
  - vladimir_putin | overall=0.902 | style=0.902 | ideology=0.902
  - mobutu_sese_seko | overall=0.900 | style=0.913 | ideology=0.887
  - kim_jong_un | overall=0.897 | style=0.917 | ideology=0.877

## case_08_revolutionary_mass_mobilizer｜革命动员型
- 预期对象：mao_zedong
- 最佳预期排名：3
- 判定：不通过
- 综合 Top 3：
  - donald_trump | overall=0.939 | style=0.917 | ideology=0.962
  - kim_jong_un | overall=0.916 | style=0.967 | ideology=0.866
  - mao_zedong | overall=0.901 | style=1.000 | ideology=0.802

## case_09_revolutionary_sovereignty_state｜革命国家主权型
- 预期对象：fidel_castro
- 最佳预期排名：7
- 判定：不通过
- 综合 Top 3：
  - donald_trump | overall=0.940 | style=0.959 | ideology=0.920
  - kim_jong_un | overall=0.886 | style=0.944 | ideology=0.828
  - mobutu_sese_seko | overall=0.852 | style=0.950 | ideology=0.753

## case_10_reconciliatory_integrator｜和解整合型
- 预期对象：nelson_mandela
- 最佳预期排名：1
- 判定：强通过
- 综合 Top 3：
  - nelson_mandela | overall=0.951 | style=1.000 | ideology=0.901
  - mao_zedong | overall=0.903 | style=0.856 | ideology=0.951
  - winston_churchill | overall=0.893 | style=0.944 | ideology=0.843

## 汇总
- 强通过：5
- 可接受：1
- 不通过：4